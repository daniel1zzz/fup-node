/**
 * @fileOverview Middleware to add image watermark to an uploaded image
 *
 * @module WaterMarkMiddleware
 * @author Daniel Andino Camacho
 * @version 1.0.0
 * @license MIT License
 */

import sharp from "sharp";
import { fileExists, isImage, readFile } from "../utils/files.js";

/**
 * Add water mark to image buffer
 * @param {Buffer} imageBaseBuffer - Buffer image base to add water mark
 * @param {string} imageWaterMarkPath - Path to the water mark file path
 * @param {string} position - Position of the image water mark
 * @param {number} position.x - Position axis x of the image water mark
 * @param {number} position.y - Position axis y of the image water mark
 * @param {number} waterMarkSettings.width - The width of image the water mark
 * @param {number} waterMarkSettings.height - The height of image the water mark
 * @returns {Promise<Buffer>} - Return buffer with water mark added
 * @throws {Error} - Image water mark don't exist
 * @throws {Error} - The watermark image is too large to add
 */
async function addWaterMarkToImage(
  imageBaseBuffer: Buffer,
  imageWaterMarkPath: string,
  position:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | { x: number; y: number },
  waterMarkSettings?: {
    width: number;
    height: number;
  }
): Promise<Buffer> {
  try {
    // Image for watermark not existing
    if ((await fileExists(imageWaterMarkPath)) == false) {
      throw new Error(
        `The image for watermark <${imageWaterMarkPath}> does not exist!`
      );
    }

    const imageBase = sharp(imageBaseBuffer);

    // Dimensions of the image base
    const widthImageBase = (await imageBase.metadata()).width ?? 0;
    const heightImageBase = (await imageBase.metadata()).height ?? 0;

    // Dimensions of the image for the watermark
    const widthImageWaterMark =
      waterMarkSettings?.width ?? (await imageBase.metadata()).width ?? 0;
    const heightImageWaterMark =
      waterMarkSettings?.height ?? (await imageBase.metadata()).height ?? 0;

    let imageWaterMark = await sharp(await readFile(imageWaterMarkPath)).resize(
      {
        width: widthImageWaterMark,
        height: heightImageWaterMark,
      }
    );

    // Position final image created
    let top = 0;
    let left = 0;

    switch (position) {
      case "center":
        top = heightImageBase / 2 - heightImageWaterMark / 2;
        left = widthImageBase / 2 - widthImageWaterMark / 2;
        break;
      case "bottom":
        top = heightImageBase - heightImageWaterMark;
        left = widthImageBase / 2 - widthImageWaterMark / 2;
        break;
      case "top":
        top = 0;
        left = widthImageBase / 2 - widthImageWaterMark / 2;
        break;
      case "left":
        top = 0;
        left = 0;
        break;
      case "right":
        top = 0;
        left = widthImageBase - widthImageWaterMark;
        break;
      default:
        top = position.y;
        left = position.x;
    }

    // Add watermark to the image base
    return await imageBase
      .composite([
        {
          input: await imageWaterMark.toBuffer(),
          top: top,
          left: left,
        },
      ])
      .toBuffer();
  } catch (error) {
    if (
      (error as Error).message ==
      "Image to composite must have same dimensions or smaller"
    ) {
      throw new Error("The watermark image is too large to add.");
    } else throw error;
  }
}

/**
 * Middleware to add a watermark to the image
 * @param {number} imageConfig.width - Width of the image used with watermark
 * @param {number} imageConfig.height - Height of the image used with watermark
 * @param {string} position - Position of the image water mark
 * @param {number} position.x - Position axis x of the image water mark
 * @param {number} position.y - Position axis y of the image water mark
 * @param {string} imageConfig.pathWaterMark - Path image for watermark
 * @throws {Error} - File type is not image
 */
export function watermark(options: {
  imageConfig: {
    width?: number;
    height?: number;
    pathWaterMark: string;
  };
  position:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | { x: number; y: number };
}) {
  return {
    middleware: async (middProps: FupMiddlewareProps) => {
      // Initialize options
      options = {
        imageConfig: {
          width: options?.imageConfig?.width ?? 0,
          height: options?.imageConfig?.height ?? 0,
          pathWaterMark: options?.imageConfig.pathWaterMark,
        },
        position: options?.position ?? "center", // Default water mark image in the center
      };
  
      // Error if file type is not type image
      if ((await isImage(middProps.processed.buffer)) == false) {
        throw new Error(
          `File <${middProps.processed.fileName}> is not an image!`
        );
      }
  
      // Add watermark to image buffer
      middProps.processed.buffer = await addWaterMarkToImage(
        middProps.processed.buffer,
        options?.imageConfig?.pathWaterMark || "",
        options?.position,
        {
          width: options?.imageConfig?.width || 0,
          height: options?.imageConfig?.height || 0,
        }
      );
  
      return {
        fileName: middProps.processed.fileName,
        fileExtension: middProps.processed.fileExtension,
        buffer: middProps.processed.buffer,
      };
    },
    typesPermitted: ["image/*"]
  }
}
