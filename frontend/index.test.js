import { expect, test } from "vitest";
import { composeFileUpload, composeMultipleFilesUpload, encodeToBase64String } from ".";

function createFileList(files) {
  files.__proto__ = FileList.prototype;
  return files;
}

test("The encodeToBase64String function encode array buffer to string base64", async () => {
  // Buffer encode to base64
  const stringBase64 = await encodeToBase64String(
    new TextEncoder().encode("Hi").buffer
  );
  expect(stringBase64).toBe("SGk=");
});

test("The composeFileUpload function prepare request body for single upload", async () => {
  const buffer = new TextEncoder().encode("Hi").buffer;
  const file = new File([buffer], "file1.txt", {
    lastModified: 1721324283925,
    type: "text/plain",
  });
  const fileList = createFileList([file]);

  expect(await composeFileUpload(fileList)).toStrictEqual({
    name: "file1.txt",
    type: "text/plain",
    lastModified: 1721324283925,
    buffer: "SGk=",
  });
});

test("The composeFileUpload function prepare request body for multiple uploads", async () => {
  const buffer = new TextEncoder().encode("Hi").buffer;
  const file1 = new File([buffer], "file1.txt", {
    lastModified: 1721324283925,
    type: "text/plain",
  });
  const file2 = new File([buffer], "file2.txt", {
    lastModified: 1721324283926,
    type: "text/plain",
  });
  const fileList = createFileList([file1, file2]);

  expect(await composeMultipleFilesUpload(fileList)).toStrictEqual([
    {
      name: "file1.txt",
      type: "text/plain",
      lastModified: 1721324283925,
      buffer: "SGk=",
    },
    {
      name: "file2.txt",
      type: "text/plain",
      lastModified: 1721324283926,
      buffer: "SGk=",
    },
  ]);
});