import { Request, Response } from "express";
import { resizeImage } from "../services/imageService";
import {
  validateFilename,
  validateDimension,
  ErrorWithCode,
} from "../utils/validation";

export const getImage = async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;

  // Check for missing parameters
  if (!filename || !width || !height) {
    return res.status(400).json({
      error:
        "Missing required parameters: filename, width, and height are all required",
    });
  }

  // Validate filename
  if (!validateFilename(filename as string)) {
    return res.status(400).json({
      error:
        "Invalid filename. Only alphanumeric characters, hyphens, and underscores are allowed",
    });
  }

  // Validate dimensions
  const w = validateDimension(width as string);
  const h = validateDimension(height as string);

  if (w === null) {
    return res.status(400).json({
      error: "Invalid width. Must be a positive integer between 1 and 5000",
    });
  }

  if (h === null) {
    return res.status(400).json({
      error: "Invalid height. Must be a positive integer between 1 and 5000",
    });
  }

  try {
    const buffer = await resizeImage(filename as string, w, h);
    res.setHeader("Content-Type", "image/jpeg");
    res.send(buffer);
  } catch (error: unknown) {
    const typedError = error as ErrorWithCode;
    if (error && typedError.name === "ImageServiceError") {
      switch (typedError.code) {
        case "FILE_NOT_FOUND":
          return res.status(404).json({ error: "Image not found" });
        case "INVALID_FILENAME":
          return res.status(400).json({ error: typedError.message });
        case "INVALID_DIMENSIONS":
          return res.status(400).json({ error: typedError.message });
        case "PROCESSING_ERROR":
          return res.status(422).json({ error: "Image processing failed" });
        case "READ_ERROR":
          return res.status(500).json({ error: "Error accessing image file" });
        default:
          return res.status(500).json({ error: "Internal server error" });
      }
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
