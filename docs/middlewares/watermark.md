# Middleware watermark

This middleware allows you to add a watermark to an uploaded image.

```ts
function watermark(options: {
  imageConfig: {
    // Width of the image used as a watermark
    width?: number;

    // Height of the image used as a watermark
    height?: number;

    // Path of the image to use as a watermark
    pathWaterMark: string;
  };

  // Position to put the watermark image
  position:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"

    // You can also give the x,y coordinates for the image position
    | { x: number; y: number };
});
```

Example of use

```ts
import { watermark } from "fup-node/src/middleware/watermark";

// Example instance
const fupinstance = new FupNode({
  path: "uploads",
});

fupinstance.uploadFile(
  bodyFile,
  watermark({
    position: "center",
    imageConfig: {
      pathWaterMark: "C:\images\water-mark.png"),
      width: 200,
      height: 200,
    },
  })
);
```
