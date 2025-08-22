import {
  ImageServiceError,
  validateFilename,
  validateDimension,
  validateImageParams,
  ErrorWithCode,
} from "../../utils/validation";

describe("Validation Utils", () => {
  describe("validateFilename", () => {
    it("should accept valid filenames", () => {
      expect(validateFilename("fjord")).toBe(true);
      expect(validateFilename("test-image")).toBe(true);
      expect(validateFilename("image_123")).toBe(true);
      expect(validateFilename("MY-IMAGE-2023")).toBe(true);
    });

    it("should reject invalid filenames", () => {
      expect(validateFilename("")).toBe(false);
      expect(validateFilename("../test")).toBe(false);
      expect(validateFilename("test.jpg")).toBe(false);
      expect(validateFilename("test/path")).toBe(false);
      expect(validateFilename("test\\path")).toBe(false);
      expect(validateFilename("test@image")).toBe(false);
      expect(validateFilename("test image")).toBe(false);
    });

    it("should reject non-string inputs", () => {
      expect(validateFilename(null as unknown as string)).toBe(false);
      expect(validateFilename(undefined as unknown as string)).toBe(false);
      expect(validateFilename(123 as unknown as string)).toBe(false);
    });
  });

  describe("validateDimension", () => {
    it("should accept valid dimensions", () => {
      expect(validateDimension("100")).toBe(100);
      expect(validateDimension("1")).toBe(1);
      expect(validateDimension("5000")).toBe(5000);
      expect(validateDimension("2500")).toBe(2500);
    });

    it("should reject invalid dimensions", () => {
      expect(validateDimension("0")).toBe(null);
      expect(validateDimension("-100")).toBe(null);
      expect(validateDimension("5001")).toBe(null);
      expect(validateDimension("abc")).toBe(null);
      expect(validateDimension("")).toBe(null);
      expect(validateDimension("100.5")).toBe(100);
    });
  });

  describe("validateImageParams", () => {
    it("should pass with valid parameters", () => {
      expect(() => validateImageParams("fjord", 100, 200)).not.toThrow();
      expect(() => validateImageParams("test-image", 1, 5000)).not.toThrow();
    });

    it("should throw for invalid filename", () => {
      expect(() => validateImageParams("", 100, 200)).toThrowError(
        "Invalid filename provided"
      );
      expect(() => validateImageParams("../test", 100, 200)).toThrowError(
        "Filename contains invalid characters"
      );
      expect(() => validateImageParams("test/path", 100, 200)).toThrowError(
        "Filename contains invalid characters"
      );
    });

    it("should throw for invalid dimensions", () => {
      expect(() => validateImageParams("fjord", 0, 200)).toThrowError(
        "Width and height must be between 1 and 5000"
      );
      expect(() => validateImageParams("fjord", 100, -1)).toThrowError(
        "Width and height must be between 1 and 5000"
      );
      expect(() => validateImageParams("fjord", 5001, 200)).toThrowError(
        "Width and height must be between 1 and 5000"
      );
      expect(() => validateImageParams("fjord", 100, 5001)).toThrowError(
        "Width and height must be between 1 and 5000"
      );
      expect(() => validateImageParams("fjord", 1.5, 200)).toThrowError(
        "Width and height must be integers"
      );
    });

    it("should throw with correct error codes", () => {
      try {
        validateImageParams("../test", 100, 200);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_FILENAME");
      }

      try {
        validateImageParams("fjord", 0, 200);
        fail("Expected error to be thrown");
      } catch (error: unknown) {
        const typedError = error as ErrorWithCode;
        expect(typedError.name).toBe("ImageServiceError");
        expect(typedError.code).toBe("INVALID_DIMENSIONS");
      }
    });
  });

  describe("ImageServiceError", () => {
    it("should create error with message and code", () => {
      const error = new ImageServiceError("Test message", "TEST_CODE");
      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("ImageServiceError");
    });

    it("should be instance of Error", () => {
      const error = new ImageServiceError("Test", "CODE");
      expect(error instanceof Error).toBe(true);
      expect(error.name).toBe("ImageServiceError");
    });
  });
});
