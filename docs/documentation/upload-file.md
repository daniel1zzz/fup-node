# Upload file

This instance is an example for demonstrations, see more about the configuration [here](/documentation/general-config)

```ts
const fupinstance = new FupNode({
  path: "uploads",
});
```

Function to upload a file

```ts
async function uploadFile(
  // File body from the `frontend` client
  file: FileBody,

  // File upload configuration settings
  options: SingleUploadSettings,

  // Middleware to use for upload
  middleware?: FupMiddleware[] | FupMiddleware
): Promise<string>; // Return name of the file created
```

To learn more about the `FupMiddleware` **type** and the use of middlewares see [here](/middlewares/middlewares)

Type `SingleUploadSettings`

```ts
type SingleUploadSettings = {
  // Custom name to name the uploaded file
  // By default the file is saved with a name generated_
  // with Date Now so as not to use `generateNameByDate` = false
  name?: string;

  // Used to generate the name to the uploaded file using current time UTC
  // By default it is activated
  generateNameByDate?: boolean;

  // It is used to generate the name of the uploaded file with a unique UUID
  generateNameByUUID?: boolean;

  // If enabled, use the original file name to save it.
  useOriginalFilename?: boolean;

  // Maximum size that the file can be uploaded by default_
  // uses the one from the general configuration
  maxFileSize?: number;

  // File types allowed for uploading
  // By default any type of file is allowed to be uploaded ["*"]
  types?: string[];
};
```

Type `FileBody`

```ts
type FileBody = {
  // Original file name in client storage
  name: string;

  // MIME type of the client file
  type: string;

  // Last modified of the file in client storage
  lastModified: number;

  // File buffer in base64 string format
  buffer: string;
};
```

Example using default configuration

```ts
// By default the file name is generated using date now
const nameFile = await fupinstance.uploadFile(bodyFile);
```

Example using custom name

`note:` Be careful when using this option because it can cause errors if you try to upload a file with the same name.

```ts
const nameFile = await fupinstance.uploadFile(bodyFile, {
  name: "custom-name.txt",

  //It is false because by default a name generated by date now is used
  generateNameByDate: false,
});
```

Example generating name by unique identifier UUID

```ts
const nameFile = await fupinstance.uploadFile(bodyFile, {
  generateNameByUUID: true,
});
```

Example generating name using the original file name

`note:` Be careful when using this option because it can cause errors if you try to upload a file with the same name.

```ts
const nameFile = await fupinstance.uploadFile(bodyFile, {
  useOriginalFilename: true,
});
```

Example allowing only specific file types to be uploaded

`note:` If any MIME type defined in the *types* list is not valid an error will occur.

```ts
// Defines that only plain text files and png images can be uploaded
const nameFile = await fupinstance.uploadFile(bodyFile, {
  types: ["text/plain", "image/png"],
});
```

```ts
// The * after the name defines that any type of image can be uploaded
const nameFile = await fupinstance.uploadFile(bodyFile, {
  types: ["image/*"],
});
```

```ts
/* 
  Using * already allows the upload of any type of file, 
  but its use is not necessary because it is used by default 
  if you do not assign types.
*/
const nameFile = await fupinstance.uploadFile(bodyFile, {
  types: ["*"],
});
```

### Error handling

**`About the error:`** The file size is larger than specified or is empty.
- **message** -> The file <`name`> size is not valid or is empty!
- `name` = It is the name of the file uploaded from the client.

----

**`About the error:`** The mime type of the uploaded file is invalid.
- **message** -> The mime type of file uploaded <`name`> is not valid!
- `name` = It is the name of the file uploaded from the client.

----

**`About the error:`** The uploaded file name is invalid.
- **message** -> The name of file uploaded <`name`> is not valid!
- `name` = It is the name of the file uploaded from the client.

----

**`About the error:`** Some mime types allowed in options.types are not valid.
- **message** -> The type -> `type` is not valid!
- `type` = It is the invalid type.

----

**`About the error:`** The mime type of the uploaded file is not allowed.
- **message** -> The type -> `type` is not included in the list of possible types!
- `type` = It is the type not allowed to upload.

----

**`About the error:`** The file already exists error can almost always occur if you use the original file name.
- **message** -> File `name` already exists!
- `name` = It is the name of the file to save on disk.

----

**`About the error:`** Error if name file passed is empty.
- **message** -> Name of file cannot be empty!