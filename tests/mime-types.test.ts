import { expect, test } from "vitest";
import { validateEspecialMimeType, validateMimeType, validateMimeTypes, validateTypeIncluded } from "../src/utils/mime-types";

test("The validateMimeType function for validate mime type is valid", async () => {
  expect(validateMimeType("text/plain")).toBe(true);
});

test("The validateMimeType function for validate mime type is not valid", async () => {
  expect(validateMimeType("text/plains")).toBe(false);
});

test("The validateEspecialMimeType function for validate especial mime type is valid", async () => {
  expect(validateEspecialMimeType("text/*")).toBe(true);
});

test("The validateEspecialMimeType function for validate especial mime type is not valid", async () => {
  expect(validateEspecialMimeType("text/.")).toBe(false);
});

test("The validateMimeTypes function for validate list of mime types", async () => {
  expect(validateMimeTypes(["image/png"])).toBe(true);
});

test("The validateMimeTypes function for validate list of mime types is not valid", async () => {
  expect(validateMimeTypes(["image/pngc"])).toBe(0);
});

test("The validateMimeTypes function for validate list of mime types * all", async () => {
  expect(validateMimeTypes(["*"])).toBe(true);
});

test("The validateMimeTypes function for validate list of especial mime types", async () => {
  expect(validateMimeTypes(["app/*"])).toBe(true);
});

test("The validateTypeIncluded function for validate if type is included in the list defined", async () => {
  expect(validateTypeIncluded("image/png", ["image/png"])).toBe(true);
});

test("The validateTypeIncluded function for validate if type is not included in the list defined", async () => {
  expect(validateTypeIncluded("image/gif", ["image/png"])).toBe(false);
});

test("The validateTypeIncluded function for validate if type is included in the list defined with especial mime type", async () => {
  expect(validateTypeIncluded("image/gif", ["image/*"])).toBe(true);
});

test("The validateTypeIncluded function for validate if type is included in the list defined with * all", async () => {
  expect(validateTypeIncluded("image/gif", ["*"])).toBe(true);
});