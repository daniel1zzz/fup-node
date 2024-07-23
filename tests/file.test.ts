import { expect, test } from "vitest";
import {
  createFile,
  fileExists,
  isImage,
  readFile,
} from "../src/utils/files";
import * as path from "node:path";

test("The fileExists function for validate file exists", async () => {
  expect(await fileExists(path.join(process.cwd(), "tests/file.test.ts"))).toBe(
    true
  );
});

test("The fileExists function for validate file not exists", async () => {
  expect(await fileExists(path.join(process.cwd(), "tests/file.test.tv"))).toBe(
    false
  );
});

test("The createFile function for create new file", async () => {
  await createFile(
    path.join(process.cwd(), "tests/upload_files/file-create.txt"),
    Buffer.from("Hi")
  );

  expect(
    await fileExists(
      path.join(process.cwd(), "tests/upload_files/file-create.txt")
    )
  ).toBe(true);
});

test("The readFile function for read content file", async () => {
  await createFile(
    path.join(process.cwd(), "tests/upload_files/file-read.txt"),
    Buffer.from("Hi")
  );

  expect(
    (
      await readFile(
        path.join(process.cwd(), "tests/upload_files/file-read.txt")
      )
    ).toString()
  ).toBe("Hi");
});

test("The isImage function for validate buffer is image", async () => {
  expect(
    await isImage(
      await readFile(path.join(process.cwd(), "tests/images/opti-image.png"))
    )
  ).toBe(true);
});
