/**
 * @fileOverview Middleware to optimize images in webp format
 *
 * @module OptimizationMiddleware
 * @author Daniel Andino Camacho
 * @version 1.0.0
 * @license MIT License
 */

import sharp from "sharp";
import { isImage } from "../utils/files.js";

/**
 * Middleware to optimize images in webp format
 * @param {number} quality - Quality of images to optimize default 60
 * @throws {Error} - Error if file.type is not type image
 */
export function optimization(options?: { quality: number }) {
  return {
    middleware: async (middProps: FupMiddlewareProps) => {
      // Initialize options
      options = {
        quality: options?.quality ?? 60, // Default quality 60
      };

      // Error if file.type is not type image
      if ((await isImage(middProps.processed.buffer)) == false) {
        throw new Error(
          `File <${middProps.file.name}> is not an image!`
        );
      }

      // Optimize image
      middProps.processed.buffer = await sharp(middProps.processed.buffer)
        .webp({
          quality: options.quality,
        })
        .toBuffer();

      return {
        fileName: middProps.processed.fileName,
        fileExtension: ".webp",
        buffer: middProps.processed.buffer,
      };
    },
    typesPermitted: ["image/*"],
  };
}
