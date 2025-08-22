import { resizeImage, getImagePath } from "../../services/imageService";
import { ErrorWithCode } from "../../utils/validation";
import fs from "fs";
import path from "path";

describe("Image Service", () => {
  const validFilename = "fjord";
  const validWidth = 100;
  const validHeight = 100;
  const thumbPath = path.join(
    __dirname,
    "../../../assets/thumb",
    `${validWidth}x${validHeight}-${validFilename}.jpg`
  );

  describe("successful operations", () => {
    it("should resize and create a thumbnail if it does not exist", async () => {
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
      const buffer = await resizeImage(validFilename, validWidth, validHeight);
      expect(buffer).toEqual(jasmine.any(Buffer));
      expect(fs.existsSync(thumbPath)).toEqual(true);
    });

    it("should return existing thumbnail without resizing again", async () => {
      const buffer = await resizeImage(validFilename, validWidth, validHeight);
      expect(buffer).toEqual(jasmine.any(Buffer));
    });

    it("should return correct image path", () => {
      const expectedPath = path.join(
        __dirname,
        "../../../assets/full",
        "fjord.jpg"
      );
      expect(getImagePath("fjord")).toBe(expectedPath);
    });
  });

  describe("parameter validation", () => {
    it("should throw for invalid filename with path traversal", async () => {
      try {
        await resizeImage("../test", validWidth, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_FILENAME");
      }
    });

    it("should throw for empty filename", async () => {
      try {
        await resizeImage("", validWidth, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_FILENAME");
      }
    });

    it("should throw for invalid dimensions", async () => {
      try {
        await resizeImage(validFilename, 0, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_DIMENSIONS");
      }
    });

    it("should throw for non-integer dimensions", async () => {
      try {
        await resizeImage(validFilename, 1.5, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_DIMENSIONS");
      }
    });

    it("should throw for dimensions too large", async () => {
      try {
        await resizeImage(validFilename, 5001, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_DIMENSIONS");
      }
    });
  });

  describe("file operations", () => {
    it("should throw FILE_NOT_FOUND for non-existent image", async () => {
      try {
        await resizeImage("nonexistent", validWidth, validHeight);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("FILE_NOT_FOUND");
        expect(typedError.message).toContain("not found");
      }
    });

    afterEach(() => {
      // Clean up test thumbnails
      if (fs.existsSync(thumbPath)) {
        try {
          fs.unlinkSync(thumbPath);
        } catch {
          // Ignore cleanup errors
        }
      }
    });
  });
});
