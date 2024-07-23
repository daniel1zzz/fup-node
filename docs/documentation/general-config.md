# General Configuration

Configuring FupNode instance for uploading files

```ts
type ConfigUploads = {
  // Destination path for uploading files
  path: string;

  // Use relative to current project directory
  // By default the relative path will be used, relativePath = true
  relativePath?: boolean;

  // Maximum size of files that can be uploaded to the instance in bytes
  // By default the maximum size is 6MB~
  maxFilesSize?: number;

  // Maximum number of files that can be uploaded to the instance
  // By default the maximum number of files is 6 files
  maxFiles?: number;
};
```

`Usage with relativePath enabled by default`

```ts
/* 
  For example the current project directory is C:\my-project 
  then the destination path would be C:\my-project\uploads 
*/
const fupinstance = new FupNode({
  path: "uploads",
});
```

`Usage with relativePath disabled`

```ts
// In this case the path entered will be the final destination path.
const fupinstance = new FupNode({
  path: "C:\my-project\uploads",
  relativePath: false
});
```