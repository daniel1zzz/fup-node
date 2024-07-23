# Getting Started

## Installation in the backend

**`Fup Node`** provides a module for uploading files in the Node.js backend and a module for preparing an object in the frontend to send to the backend

**Use in the backend**

```sh
$ npm install fup-node
```

**Use in the frontend**

```sh
$ npm install fup-node-front
```

## Basic example

#### `Backend use`

```ts
import { FupNode } from "fup-node";

// Upload files to in the current project folder, default use relative path
const fileUpload = new FupNode({
  path: "tests/upload_files",
});

// Body file upload from frontend, this is an example of a file body.
// This object is sent from the frontend.
const bodyFile = {
  name: "file.txt",
  type: "text/plain",
  lastModified: new Date().getTime(),
  buffer: "SGk=", // Buffer from file upload
};

// Name of file uploaded
const nameFile = await fileUpload.uploadFile(
  // Data uploaded from the frontend
  bodyFile,
  {
    types: ["text/plain"],
  }
);
```

#### `Frontend use`

```js
// Example in ReactJS
import { composeFileUpload } from "fup-node-front";

export function MyComponent() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const files = event.target.elements.file.files;
    const data = {
      // To upload multiple files use composeMultipleFilesUpload
      file: await composeFileUpload(files),
    };

    try {
      // Example api url
      const response = await fetch("https://example.com/api/upload-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) console.log("Error sending file.");

      alert("File upload ok!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file">Select a file:</label>
      <input type="file" id="file" name="file" />
      <br />
      <br />
      <button type="submit">Upload</button>
    </form>
  );
}
```
