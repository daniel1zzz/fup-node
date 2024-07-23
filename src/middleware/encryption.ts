/**
 * @fileOverview Middleware to encrypt/decrypt files with aes-256-cbc
 *
 * @module EncryptionMiddleware
 * @author Daniel Andino Camacho
 * @version 1.0.0
 * @license MIT License
 */

import crypto from "crypto";

/**
 * Encrypt buffer file with password
 * @param {Buffer} buffer - Buffer for encrypt
 * @returns {Promise<Buffer>} - Return buffer encrypted
 */
export async function encryptBuffer(
  buffer: Buffer,
  password: string
): Promise<Buffer> {
  const key = crypto.scryptSync(password, "salt", 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encryptedBuffer = Buffer.concat([
    iv,
    cipher.update(buffer),
    cipher.final(),
  ]);

  return encryptedBuffer;
}

/**
 * Desencrypt buffer file with password
 * @param {Buffer} encryptedBuffer - Buffer for desencrypt
 * @returns {Promise<Buffer>} - Return buffer desencrypted or Buffer "" for desencrypt incorrect
 */
export async function desencryptBuffer(
  encryptedBuffer: Buffer,
  password: string
): Promise<Buffer> {
  const key = crypto.scryptSync(password, "salt", 32); // Derive a key from the password
  const iv = encryptedBuffer.slice(0, 16); // Extract the IV from the start of the encrypted buffer
  const encryptedContent = encryptedBuffer.slice(16); // Get the real encrypted content

  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedContent),
      decipher.final(),
    ]);
    return decryptedBuffer;
  } catch {
    return Buffer.from("");
  }
}

/**
 * Middleware to encrypt file
 * @param {string} password - Password to use in encrypting the file
 * @throws {Error} - The password for encrypting the file is empty
 */
export function encryption(options: { password: string }) {
  return {
    middleware: async (middProps: FupMiddlewareProps) => {
      // Error if password is empty
      if (options.password == "") {
        throw new Error(
          `The password for encrypting ${middProps.processed.fileName} is empty!`
        );
      }

      // Encrypt buffer file
      middProps.processed.buffer = await encryptBuffer(
        middProps.processed.buffer,
        options.password
      );

      return {
        fileName: middProps.processed.fileName,
        fileExtension: ".encf",
        buffer: middProps.processed.buffer,
      };
    },
    typesPermitted: ["*"],
  };
}
