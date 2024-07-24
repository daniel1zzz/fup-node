import mime from "mime";
import {
  validateMimeType,
  validateMimeTypes,
  validateTypeIncluded,
} from "./utils/mime-types.js";
import { randomUUID } from "crypto";
import * as path from "node:path";
import { createFile, fileExists, isImage, readFile } from "./utils/files.js";
import sharp from "sharp";
import {
  ConfigUploads,
  FileBody,
  FupMiddleware,
  MultipleUploadSettings,
  SingleUploadSettings,
} from "../types/index.js";

export class FupNode {
  private config: ConfigUploads = {
    path: "", // Path for upload files
    relativePath: true, // Use relative path instead to upload files
    maxFilesSize: 6000000, // Maximum size of all files uploaded 6MB
    maxFiles: 6, // Maximum count of all files uploaded * -> "multiple files only"
  };

  /**
   * Configure upload settings.
   * @param {ConfigUploads} config - Configuration instance for the upload files
   */
  constructor(config: ConfigUploads) {
    this.config = {
      path: config.path,
      relativePath: config.relativePath ?? this.config.relativePath,
      maxFilesSize: config.maxFilesSize ?? this.config.maxFilesSize,
      maxFiles: config.maxFiles ?? this.config.maxFiles,
    };
  }

  /**
   * Upload single file.
   * @param {FileBody} file - Body of file to upload
   * @param {SingleUploadSettings} options - Settings for uploading file
   * @param {FupMiddleware[] | FupMiddleware} middleware - Middleware for extra caracteristics in uploading file
   * @returns {Promise<string>} - Return name of uploaded file
   * @throws {Error} The file size is larger than specified or is empty.
   * @throws {Error} The mime type of the uploaded file is invalid.
   * @throws {Error} The uploaded file name is invalid.
   * @throws {Error} Some mime types allowed in options.types are not valid.
   * @throws {Error} The mime type of the uploaded file is not allowed.
   * @throws {Error} The file already exists error can almost always occur if you use the original file name.
   * @throws {Error} Error if name file passed is empty
   */
  public async uploadFile(
    file: FileBody,
    options?: SingleUploadSettings,
    middleware?: FupMiddleware[] | FupMiddleware
  ): Promise<string> {
    //Initialize options
    options = {
      name: options?.name ?? "",
      types: options?.types ?? ["*"], // Default upload types all *
      generateNameByDate: options?.generateNameByDate ?? true, // Default generate name by date now true
      generateNameByUUID: options?.generateNameByUUID ?? false, // Default generate name by UUID false
      useOriginalFilename: options?.useOriginalFilename ?? false, // Default use original filename false
      maxFileSize: options?.maxFileSize ?? this.config.maxFilesSize, // Default max file size 6MB
    };

    // Size of the file to upload
    const fileSize =
      ((options.maxFileSize || 0) > 0
        ? options.maxFileSize
        : this.config.maxFilesSize) || 0;

    //Buffer from FileBody buffer string
    let buffer = Buffer.from(file.buffer, "base64");

    // Check file size > fileSize or = 0
    if (buffer.length > fileSize || buffer.length == 0) {
      throw new Error(`The file <${file.name}> size is not valid or is empty!`);
    }

    // Check the mime type of file uploaded is valid
    if (!validateMimeType(file.type)) {
      throw new Error(
        `The mime type of file uploaded <${file.name}> is not valid!`
      );
    }

    // Check the name of file uploaded is valid
    if (!/^[^<>:"/\\|?*\x00-\x1F]+$/.test(file.name)) {
      throw new Error(`The name of file uploaded <${file.name}> is not valid!`);
    }

    // Check the types in options.types are valid
    const validTypes = validateMimeTypes(options.types ?? []);
    if (validTypes !== true)
      throw new Error(
        `The type -> ${
          options.types &&
          options.types[typeof validTypes == "number" ? validTypes : 0]
        } is not valid!`
      );

    // Check the file.type is included in options.types
    if (!validateTypeIncluded(file.type, options.types ?? [])) {
      throw new Error(
        `The type -> ${file.type} is not included in the list of possible types!`
      );
    }

    // Generate name for file
    let nameFile = options.name ?? "";

    // Generate name by date now by default date now
    if (options.generateNameByDate) {
      nameFile = `file-${new Date().getTime()}.${mime.getExtension(file.type)}`;
    }

    // Generate name by UUID identifier
    if (options.generateNameByUUID) {
      nameFile = `file-${randomUUID()}.${mime.getExtension(file.type)}`;
    }

    // Use original filename
    if (options.useOriginalFilename) {
      nameFile = file.name;
    }

    // Check name file is not empty
    if (nameFile == "" || nameFile == undefined) {
      throw new Error(`Name of file cannot be empty!`);
    }

    // For image remove metadata important
    if (await isImage(buffer)) buffer = await sharp(buffer).toBuffer();

    // Call all middleware
    if (Array.isArray(middleware)) {
      for (const middlewareFuntion of middleware) {
        if (validateTypeIncluded(file.type, middlewareFuntion.typesPermitted)) {
          const res = await middlewareFuntion.middleware({
            file: file,
            processed: {
              fileName: nameFile.slice(0, nameFile.indexOf(".")),
              fileExtension: nameFile.slice(
                nameFile.indexOf("."),
                nameFile.length
              ),
              buffer: buffer,
            },
          });

          buffer = res.buffer;
          nameFile = res.fileName + res.fileExtension;
        }
      }
    } else if (middleware != undefined) {
      if (validateTypeIncluded(file.type, middleware.typesPermitted)) {
        const res = await middleware.middleware({
          file: file,
          processed: {
            fileName: nameFile.slice(0, nameFile.indexOf(".")),
            fileExtension: nameFile.slice(
              nameFile.indexOf("."),
              nameFile.length
            ),
            buffer: buffer,
          },
        });

        buffer = res.buffer;
        nameFile = res.fileName + res.fileExtension;
      }
    }

    // Generate path to the file
    const pathFile = this.config.relativePath
      ? path.join(process.cwd(), this.config.path, nameFile)
      : path.join(this.config.path, nameFile);

    // Check if the file already exists
    if (await fileExists(pathFile)) {
      throw new Error(`File ${nameFile} already exists!`);
    }

    // Create file with buffer uploaded
    await createFile(pathFile, buffer);

    return nameFile;
  }

  /**
   * Upload multiple files.
   * @param {FileBody[]} files - Body of the files to upload
   * @param {MultipleUploadSettings} options - Settings for uploading files
   * @param {FupMiddleware[] | FupMiddleware} middlewares - Middleware for extra caracteristics in uploading files
   * @returns {Promise<string[]>} - Return name of uploaded files
   * @throws {Error} - Error the max files is exceeded.
   * @throws {Error} - The number of files uploaded not equal to number of names
   */
  public async uploadMultipleFiles(
    files: FileBody[],
    options?: MultipleUploadSettings,
    middlewares?: FupMiddleware[] | FupMiddleware
  ): Promise<string[]> {
    //Initialize options
    options = {
      names: options?.names ?? [], // Default names of files []
      types: options?.types ?? ["*"], // Default upload types all *
      generateNamesByDate: options?.generateNamesByDate ?? true, // Default generate name by date now true
      generateNamesByUUID: options?.generateNamesByUUID ?? false, // Default generate name by UUID false
      useOriginalFilenames: options?.useOriginalFilenames ?? false, // Default use original filename false
      maxFilesSize: options?.maxFilesSize ?? this.config.maxFilesSize, // Default max file size 6MB
      maxFiles: options?.maxFiles ?? this.config.maxFiles, // Default max file 6
    };

    // Error max files is exceeded
    if (files.length > (options?.maxFiles || 0)) {
      throw new Error(
        `The number of files uploaded exceeds the maximum allowed of ${options.maxFiles}!`
      );
    }

    // Error names.length is not equal to number of files
    if (
      options.names != undefined &&
      options.names.length != 0 &&
      files.length != options.names.length
    ) {
      throw new Error(
        "The number of files uploaded not equal to number of names!"
      );
    }

    // Names of files uploaded to the disk
    let nameFiles: string[] = [];

    for (const file of files) {
      // Upload file from files
      const name = await this.uploadFile(
        file,
        {
          name:
            options.names != undefined
              ? options.names[files.indexOf(file)]
              : "",
          types: options.types,
          generateNameByDate: options.generateNamesByDate,
          generateNameByUUID: options.generateNamesByUUID,
          useOriginalFilename: options.useOriginalFilenames,
          maxFileSize: options.maxFilesSize,
        },
        middlewares
      );

      // Add the name to the list of names of files uploaded to the disk
      nameFiles.push(name);
    }

    return nameFiles;
  }

  /**
   * Get file from disk preventing reverse path.
   * @param {string} name - Name of the file to read
   * @returns {Promise<Buffer>} - Return buffer of the file readed
   * @throws {Error} - Error file name is not valid
   * @throws {Error} - Error file don't exist
   */
  public async getFile(name: string): Promise<Buffer> {
    // Error invalid file name
    if (!/^[^<>:"/\\|?*\x00-\x1F]+$/.test(name)) {
      throw new Error(`Invalid file name: ${name}`);
    }

    // Generate path to the file
    const pathFile = this.config.relativePath
      ? path.join(process.cwd(), this.config.path, name)
      : path.join(this.config.path, name);

    // Check if the file exists
    if (!(await fileExists(pathFile))) {
      throw new Error(`File ${name} don't exist!`);
    }

    return readFile(pathFile);
  }
}

export type {
  ConfigUploads,
  FileBody,
  SingleUploadSettings,
  MultipleUploadSettings,
  FupMiddleware,
  FupMiddlewareProps,
} from "../types/index.js";
