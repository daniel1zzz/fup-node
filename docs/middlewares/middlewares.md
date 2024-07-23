# Middlewares

How to define a middleware

```ts
function middlewareName(options: {
  /* 
    The options are optional and are a way to define parameters 
    for internal use of the middleware.
  */
}) {
  return {
    middleware: async (middProps: FupMiddlewareProps) => {
      return {
        // The final name in case it has been modified in the middleware
        fileName: "filename",

        // The final extension in case it has been modified in the middleware
        fileExtension: ".extension",

        // Buffer in case it has been modified in the middleware
        buffer: middProps.processed.buffer,
      };
    },

    // These are the allowed types where the middleware will be applied.
    typesPermitted: ["*"],
  };
}
```

Type `FupMiddlewareProps`

```ts
type FupMiddlewareProps = {
  // It is the original body of the uploaded file
  file: FileBody;
  processed: {
    // It is the name of the file processed by the upload function.
    fileName: string;

    // It is the extension of the file processed by the upload function.
    fileExtension: string;

    // It is the buffer of the file processed by the upload function
    buffer: Buffer;
  };
};
```

Example of middleware that changes the extension of a file if it is txt

```ts
function changeExtension(options: { newExtension: string }) {
  return {
    middleware: async (middProps: FupMiddlewareProps) => {
      return {
        fileName: middProps.processed.fileName,
        fileExtension: newExtension,
        buffer: middProps.processed.buffer,
      };
    },
    typesPermitted: ["text/plain"],
  };
}
```

Using the example middleware

```ts
// Example instance
const fupinstance = new FupNode({
  path: "uploads",
});

// Upload file using example middleware 
fupinstance.uploadFile(
  bodyFile,
  changeExtension({
    newExtension: ".myext",
  })
);
```
