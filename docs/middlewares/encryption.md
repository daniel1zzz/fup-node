# Middleware encryption

This middleware allows you to encrypt a file with a password in aes-256-cbc format

```ts
function encryption(options: {
  // Password to encrypt file
  password: string;
});
```

Example of use

```ts
import { desencryptBuffer, encryption } from "fup-node/middleware/encryption";

// Example instance
const fupinstance = new FupNode({
  path: "uploads",
});

const fileName = await fupinstance.uploadFile(
  bodyFile,
  encryption({
    password: "password",
  })
);
```

How to decrypt the file

```ts
// Get buffer from file encrypted
const bufferDes = await desencryptBuffer(
  encryptedBuffer: await fupinstance.getFile(fileName),
  password: "password",
)
```
