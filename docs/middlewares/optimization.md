# Middleware optimization

This middleware allows you to optimize an uploaded image.

```ts
function optimization(options?: {
  // Quality for image optimization by default is 60%
  quality: number;
});
```

Example of use

```ts
import { optimization } from "fup-node/src/middleware/optimization";

// Example instance
const fupinstance = new FupNode({
  path: "uploads",
});

fupinstance.uploadFile(
  bodyFile,
  optimization({
    quality: 40, // default quality is 60%
  })
);
```
