import { expect, test } from "vitest";
import { desencryptBuffer, encryptBuffer } from "../src/middleware/encryption";

test("The encryptBuffer and desencryptBuffer function for encrypt buffer with password", async () => {
  expect(
    (
      await desencryptBuffer(
        await encryptBuffer(Buffer.from("Hello world!"), "password"),
        "password"
      )
    ).toString()
  ).toBe("Hello world!");
});

test("The desencryptBuffer function for desencrypt buffer with password is not correct", async () => {
  expect(
    (
      await desencryptBuffer(
        await encryptBuffer(Buffer.from("Hello world!"), "password"),
        "passwordA"
      )
    ).toString()
  ).toBe("");
});
