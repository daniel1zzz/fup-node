import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";

/**
 * Check if the file exists.
 * @param {string} pathFile - Path of the file to check.
 * @returns {Promise<boolean>} - True if the file exists or false.
 */
export async function fileExists(pathFile: string): Promise<boolean> {
  try {
    await fs.access(pathFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a new file at the specified path.
 * @param {string} pathFile - Path of the file to create.
 * @param {Buffer} buffer - Buffer to write in the file.
 */
export async function createFile(pathFile: string, buffer: Buffer) {
  await fs.appendFile(pathFile, buffer);
}

/**
 * Read file at the specified path.
 * @param {string} pathFile - Path of the file to read.
 * @returns {Promise<Buffer>} - Buffer reading from the file.
 * @throws {Error} The file not exist.
 */
export async function readFile(pathFile: string): Promise<Buffer> {
  if ((await fileExists(pathFile)) == false) {
    throw new Error(`The file ${path.basename(pathFile)} not exist!`);
  }
  return await fs.readFile(pathFile);
}

/**
 * Validate if the buffer file is an image file
 * @param {Buffer} buffer - Buffer file to validation
 * @returns {Promise<boolean>} - True if the buffer is image or false otherwise.
 */
export async function isImage(buffer: Buffer): Promise<boolean> {
  try {
    await sharp(buffer).metadata();
    return true;
  } catch {
    return false;
  }
}
