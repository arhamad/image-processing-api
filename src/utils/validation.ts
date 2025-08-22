export class ImageServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ImageServiceError";
  }
}

export interface ErrorWithCode {
  name: string;
  code: string;
  message: string;
}

export type ErrorCode =
  | "INVALID_FILENAME"
  | "INVALID_DIMENSIONS"
  | "FILE_NOT_FOUND"
  | "READ_ERROR"
  | "PROCESSING_ERROR";

export const validateFilename = (filename: string): boolean => {
  if (!filename || typeof filename !== "string") return false;
  // Allow only alphanumeric, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(filename) && !filename.includes("..");
};

export const validateDimension = (value: string): number | null => {
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0 || num > 5000) return null;
  return num;
};

export const validateImageParams = (
  filename: string,
  width: number,
  height: number
): void => {
  // Security check for filename
  if (!filename || typeof filename !== "string") {
    throw new ImageServiceError(
      "Invalid filename provided",
      "INVALID_FILENAME"
    );
  }

  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    throw new ImageServiceError(
      "Filename contains invalid characters",
      "INVALID_FILENAME"
    );
  }

  // Validate dimensions
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new ImageServiceError(
      "Width and height must be integers",
      "INVALID_DIMENSIONS"
    );
  }

  if (width <= 0 || height <= 0 || width > 5000 || height > 5000) {
    throw new ImageServiceError(
      "Width and height must be between 1 and 5000",
      "INVALID_DIMENSIONS"
    );
  }
};
