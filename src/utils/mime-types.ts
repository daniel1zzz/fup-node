import mime from "mime";

// Expression for validating mime type custom * example app/*
const MIME_TYPE_ALL = /^([a-zA-Z0-9-]+)\/(\*)$/;

/**
 * Validate mime type.
 * @param {string} mimeType - Mime type for validating.
 * @returns {boolean} - True for valid mime type or false for not valid.
 */
export function validateMimeType(mimeType: string): boolean {
  //Check if mime type is valid
  return mime.getExtension(mimeType) == null ||
    mime.getExtension(mimeType) == ""
    ? false
    : true;
}

/**
 * Validate especial mime type example app/* .
 * @param {string} mimeType - Mime type for validating.
 * @returns {boolean} - True for valid mime type or false for not valid.
 */
export function validateEspecialMimeType(mimeType: string): boolean {
  //Check if mime type is especial custom mime type
  return MIME_TYPE_ALL.test(mimeType);
}

/**
 * Validate list of mime types.
 * @param {string[]} mimeTypes - Mime types for validating.
 * @returns {boolean} - True if all mime types are acceptable.
 * @returns {number} - For invalid type return index of mime type.
 */
export function validateMimeTypes(mimeTypes: string[]): boolean | number {
  //All mime types are acceptable
  if (mimeTypes.includes("*")) return true;

  for (const mimeType of mimeTypes) {
    if (!validateMimeType(mimeType) && !validateEspecialMimeType(mimeType)) {
      return mimeTypes.indexOf(mimeType);
    }
  }
  return true;
}

/**
 * Validate type is included in the mime type list.
 * @param {string} type - Type for validation
 * @param {string[]} types - Mime types list.
 * @returns {boolean} - True if type is included in the list or false otherwise
 */
export function validateTypeIncluded(type: string, types: string[]): boolean {
  //All mime types are acceptable
  if (types.includes("*")) return true;

  for (const mimeType of types) {
    if (mimeType == type) {
      return true;
    }
    // Validate especial mime type example/*
    else if (
      validateEspecialMimeType(mimeType) &&
      type.split("/")[0] == mimeType.split("/")[0]
    ) {
      return true;
    }
  }
  return false;
}
