/**
 * Settings for the FupNode instance
 * @type {ConfigUploads}
 * @param {string} path - Path to upload files in the storage
 * @param {boolean} relativePath - If true use the current working directory path
 * @param {number} maxFilesSize - Maximum size of uploaded files
 * @param {number} maxFiles - Maximum count of uploaded files
 */
export type ConfigUploads = {
  path: string;
  relativePath?: boolean;
  maxFilesSize?: number;
  maxFiles?: number;
};

/**
 * Body data for upload request
 * @type {FileBody}
 * @param {string} name - Original name of the file to upload
 * @param {string} type - MIME type of the file to upload
 * @param {number} lastModified - Last modification time of the file to upload
 * @param {string} buffer - Buffer of the file to upload in encoded by default base64
 */
export type FileBody = {
  name: string;
  type: string;
  lastModified: number;
  buffer: string;
};

/**
 * Settings for single file upload
 * @type {SingleUploadSettings}
 * @param {string} name - Name of the file to upload in the disk, for use name custom pass parameter `generateNameByDate` = `false`.
 * @param {boolean} generateNameByDate - If true generate name by date now, use by default.
 * @param {boolean} generateNameByUUID - If true generate name by UUID identifier.
 * @param {boolean} useOriginalFilename - If true use original filename for the file uploaded.
 * @param {number} maxFileSize - Maximum size of the file uploaded default is 6MB.
 * @param {string[]} types - Mime types permitted to be uploaded.
 */
export type SingleUploadSettings = {
  name?: string;
  generateNameByDate?: boolean;
  generateNameByUUID?: boolean;
  useOriginalFilename?: boolean;
  maxFileSize?: number;
  types?: string[];
};

/**
 * Settings for multiple files upload
 * @type {MultipleUploadSettings}
 * @param {string} names - Name of the files to upload in the disk, for use name custom pass parameter `generateNameByDate` = `false`.
 * @param {boolean} generateNamesByDate - If true generate names by date now, use by default.
 * @param {boolean} generateNamesByUUID - If true generate names by UUID identifier.
 * @param {boolean} useOriginalFilenames - If true use original filenames for the files uploaded.
 * @param {number} maxFilesSize - Maximum size of the files uploaded default is 6MB.
 * @param {string[]} types - Mime types permitted to be uploaded.
 */
export type MultipleUploadSettings = {
  names?: string[];
  generateNamesByDate?: boolean;
  generateNamesByUUID?: boolean;
  useOriginalFilenames?: boolean;
  maxFilesSize?: number;
  maxFiles?: number;
  types?: string[];
};

/**
 * Middleware handler type
 * @type {FupMiddleware}
 * @param {FupMiddlewareProps} middProps - Properties from upload settings
 * @param {string} fileName - File name modified returned from the function
 * @param {string} fileExtension - File extension modified returned from the function example .txt
 * @param {string} buffer - File buffer modified returned from the function
 * @param {string[]} typesPermitted - File type where middleware is allowed to be used
 */
export type FupMiddleware = {
  middleware: (middProps: FupMiddlewareProps) => Promise<{
    fileName: string;
    fileExtension: string;
    buffer: Buffer;
  }>;
  typesPermitted: string[];
};

/**
 * Props for the middleware internal use
 * @type {FupMiddlewareProps}
 * @param {FileBody} file - Body of the original file for possible use
 * @param {string} fileName - File name returned from the middleware
 * @param {string} fileExtension - File extension returned from the middleware
 * @param {string} buffer - File buffer returned from the middleware
 */
export type FupMiddlewareProps = {
  file: FileBody;
  processed: {
    fileName: string;
    fileExtension: string;
    buffer: Buffer;
  };
};
