# Usage in the frontend

How to upload a single file `example`

```js
// Example in ReactJS
import { composeFileUpload } from "fup-node-front";

export function MyComponent() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const files = event.target.elements.file.files;
    const data = {
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

How to upload multiple files `example`

```js
// Example in ReactJS
import { composeMultipleFilesUpload } from "fup-node-front";

export function MyComponent() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const files = event.target.elements.file.files;
    const data = {
      files: await composeMultipleFilesUpload(files),
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
      <label htmlFor="file">Select files:</label>
      <input type="file" id="file" name="file" multiple />
      <br />
      <br />
      <button type="submit">Upload</button>
    </form>
  );
}
```