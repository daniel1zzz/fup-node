# Get files from the directory specified

This instance is an example for demonstrations, see more about the configuration [here](/documentation/general-config)

```ts
const fupinstance = new FupNode({
  path: "uploads",
});
```

This function allows you to read the specified file and prevents `reverse path` attack.

```ts
async function getFile(
  // Name of the file to read from the directory specified
  name: string
): Promise<Buffer>; // Buffer returned from file readed
```

Example usage

```ts
const bufferFile = await fupinstance.getFile("file.txt");
```

### Error handling

**`About the error:`** The name of the file is invalid.
- **message** -> Invalid file name: `name`
- `name` = It is the name of the specified file.

----

**`About the error:`** Error file don't exist.
- **message** -> File `name` don't exist!
- `name` = It is the name of the specified file.