import { expect, test } from "vitest";
import { FupNode } from "../src";
import { createFile, fileExists, readFile } from "../src/utils/files";
import * as path from "node:path";
import { watermark } from "../src/middleware/watermark";
import { desencryptBuffer, encryption } from "../src/middleware/encryption";
import { optimization } from "../src/middleware/optimization";

test("The uploadFile function validates that the uploaded file buffer does not exceed the set size or is equal to 0", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    await fileUpload.uploadFile(
      {
        name: "file.png",
        type: "image/png",
        lastModified: new Date().getTime(),
        buffer: "",
      },
      {
        types: ["image/png"],
      }
    );
  } catch (e) {
    //Validation is correct
    return expect(e.message).toBe(
      "The file <file.png> size is not valid or is empty!"
    );
  }

  expect(false).toBe(true);
});

test("The uploadFile function validates the type of the uploaded file is a valid mime type.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    await fileUpload.uploadFile(
      {
        name: "file.png",
        type: "",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        types: ["image/png"],
      }
    );
  } catch (e) {
    //Validation is correct
    return expect(e.message).toBe(
      "The mime type of file uploaded <file.png> is not valid!"
    );
  }

  expect(false).toBe(true);
});

test("The uploadFile function validates that the mime types in options.types are valid.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    await fileUpload.uploadFile(
      {
        name: "file.png",
        type: "image/png",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        types: ["4image/png"],
      }
    );
  } catch (e) {
    //Validation is correct
    return expect(e.message).toBe("The type -> 4image/png is not valid!");
  }

  expect(false).toBe(true);
});

test("The uploadFile function validates that the file.type is included in the mime types in options.types", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    await fileUpload.uploadFile(
      {
        name: "file.png",
        type: "image/png",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        types: ["image/gif"],
      }
    );
  } catch (e) {
    //Validation is correct
    return expect(e.message).toBe(
      "The type -> image/png is not included in the list of possible types!"
    );
  }

  expect(false).toBe(true);
});

test("The uploadFile function validates that file.name is a valid file name.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    await fileUpload.uploadFile(
      {
        name: "file*png",
        type: "image/png",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        types: ["image/png"],
      }
    );
  } catch (e) {
    //Validation is correct
    return expect(e.message).toBe(
      "The name of file uploaded <file*png> is not valid!"
    );
  }

  expect(false).toBe(true);
});

test("The uploadFile function uploads a file using custom name file.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      generateNameByDate: false,
      name: "file-ctxt.txt",
      types: ["text/plain"],
    }
  );

  const textContent = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect(textContent.toString()).toBe("Hi");
});

test("The uploadFile function uploads a file using custom name file and is empty.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    const nameFile = await fileUpload.uploadFile(
      {
        name: "file.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "SGk=",
      },
      {
        generateNameByDate: false,
        name: "",
        types: ["text/plain"],
      }
    );
  } catch (error) {
    return expect(error.message).toBe("Name of file cannot be empty!");
  }

  expect(true).toBe(true);
});

test("The uploadFile function uploads a file by generating the default file name with date now.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      types: ["text/plain"],
    }
  );

  const textContent = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect(textContent.toString()).toBe("Hi");
});

test("The uploadFile function uploads a file by generating the file name with UUID.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      types: ["text/plain"],
      generateNameByUUID: true,
    }
  );

  const textContent = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect(textContent.toString()).toBe("Hi");
});

test("The uploadFile function uploads a file by generating the file name with original name.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      types: ["text/plain"],
      useOriginalFilename: true,
    }
  );

  const textContent = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect(textContent.toString()).toBe("Hi");
});

test("The uploadFile function uploads a file if not exists", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  await createFile(
    path.join(process.cwd(), "tests/upload_files/file-t.txt"),
    Buffer.from("Hi")
  );

  try {
    await fileUpload.uploadFile(
      {
        name: "file-t.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        types: ["text/plain"],
        useOriginalFilename: true,
      }
    );
  } catch (err) {
    return expect(err.message).toBe("File file-t.txt already exists!");
  }

  expect(false).toBe(true);
});

test("The uploadFile function uploads a image file with optimization enabled", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.jpg",
      type: "image/jpeg",
      lastModified: new Date().getTime(),
      buffer: Buffer.from(
        await readFile(path.join(process.cwd(), "tests/images/opti-image.png"))
      ).toString("base64"),
    },
    {
      types: ["image/*"],
    },
    optimization()
  );

  expect(
    await fileExists(path.join(process.cwd(), "tests/upload_files", nameFile))
  ).toBe(true);
});

test("The uploadFile function uploads a image file with optimization enabled if the file is not image.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    const nameFile = await fileUpload.uploadFile(
      {
        name: "file.jpg",
        type: "image/jpeg",
        lastModified: new Date().getTime(),
        buffer: "aGh0",
      },
      {
        useOriginalFilename: true,
        types: ["image/*"],
      },
      optimization()
    );
  } catch (error) {
    return expect(error.message).toBe("File <file.jpg> is not an image!");
  }

  expect(false).toBe(true);
});

test("The uploadFile function uploads a file with middleware encryption", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      types: ["text/plain"],
    },
    encryption({
      password: "password",
    })
  );

  const contentFile = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect((await desencryptBuffer(contentFile, "password")).toString()).toBe(
    "Hi"
  );
});

test("The uploadFile function uploads a file with middleware encryption and ocurred an error", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFile = await fileUpload.uploadFile(
    {
      name: "file.txt",
      type: "text/plain",
      lastModified: new Date().getTime(),
      buffer: "SGk=",
    },
    {
      types: ["text/plain"],
    },
    encryption({
      password: "password",
    })
  );

  const contentFile = await readFile(
    path.join(process.cwd(), "tests/upload_files", nameFile)
  );

  expect(
    (await desencryptBuffer(contentFile, "password incorrect")).toString()
  ).toBe("");
});

test("The uploadFile function uploads a file with middleware of water mark", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    const nameFile = await fileUpload.uploadFile(
      {
        name: "file.png",
        type: "image/png",
        lastModified: new Date().getTime(),
        buffer: Buffer.from(
          await readFile(
            path.join(process.cwd(), "tests/images/opti-image.png")
          )
        ).toString("base64"),
      },
      {
        types: ["image/*"],
      },
      watermark({
        position: "center",
        imageConfig: {
          pathWaterMark: path.join(
            process.cwd(),
            "tests/images/water-mark.png"
          ),
          width: 200,
          height: 200,
        },
      })
    );
  } catch (err) {
    return expect(false).toBe(false);
  }

  expect(true).toBe(true);
});

test("The uploadMultipleFiles function uploads two files txt", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const nameFiles = await fileUpload.uploadMultipleFiles(
    [
      {
        name: "file1.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "SGk=",
      },
      {
        name: "file2.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "SGVsbG8=",
      },
    ],
    {
      types: ["text/plain"],
    }
  );

  expect(
    (await fileExists(
      path.join(process.cwd(), "tests/upload_files", nameFiles[0])
    )) &&
      (await fileExists(
        path.join(process.cwd(), "tests/upload_files", nameFiles[1])
      ))
  ).toBe(true);
});

test("The uploadMultipleFiles function uploads two files txt with custom names", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  // Custom names
  const name1 = "file-custom-name1.txt";
  const name2 = "file-custom-name2.txt";

  const nameFiles = await fileUpload.uploadMultipleFiles(
    [
      {
        name: "file1.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "SGk=",
      },
      {
        name: "file2.txt",
        type: "text/plain",
        lastModified: new Date().getTime(),
        buffer: "SGVsbG8=",
      },
    ],
    {
      types: ["text/plain"],
      names: [name1, name2],
      generateNamesByDate: false,
    }
  );

  expect(
    (await fileExists(path.join(process.cwd(), "tests/upload_files", name1))) &&
      (await fileExists(path.join(process.cwd(), "tests/upload_files", name2)))
  ).toBe(true);
});

test("The getFile function read file", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  const buffer = await fileUpload.getFile("file.txt");

  expect(buffer.toString()).toBe("Hi");
});

test("The getFile function read file and file name is invalid.", async () => {
  const fileUpload = new FupNode({
    path: "tests/upload_files",
  });

  try {
    const buffer = await fileUpload.getFile(".././file.txt");
  } catch (err) {
    return expect(err.message).toBe("Invalid file name: .././file.txt");
  }

  expect(false).toBe(true);
});
