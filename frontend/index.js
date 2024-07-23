/**
 * @fileOverview This module contains functions that are used to create objects for request uploads
 *
 * @module FupNodeFrontend
 * @author Daniel Andino Camacho
 * @version 1.0.0
 * @license MIT License
 */

/**
 * Convert ArrayBuffer in string base64 encoding
 * @param {ArrayBuffer} arrayBuffer - Buffer to compose.
 * @returns {Promise<string>} - String base64 representation of file.
 */
export async function encodeToBase64String(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

/**
 * Construct body element for upload request single file
 * @param {FileList} file - File to compose.
 * @returns {object} - Object with body for upload request
 */
export async function composeFileUpload(file) {
  return {
    name: file[0].name,
    type: file[0].type,
    lastModified: file[0].lastModified,
    buffer: await encodeToBase64String(await file[0].arrayBuffer()),
  };
}

/**
 * Construct array of bodies element for upload request multiple files
 * @param {FileList} files - Files to compose.
 * @returns {object[]} - Objects with bodies for upload request
 */
export async function composeMultipleFilesUpload(files) {
  // Bodies returned from compose
  let resFiles = [];

  for (const file of files) {
    resFiles.push({
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      buffer: await encodeToBase64String(await file.arrayBuffer()),
    });
  }
  return resFiles;
}
