import sharp from "sharp";
import fs from "fs";
import path from "path";
import { ImageServiceError, validateImageParams } from "../utils/validation";

const FULL_DIR = path.join(__dirname, "../../assets/full");
const THUMB_DIR = path.join(__dirname, "../../assets/thumb");

// Ensure thumb folder exists
if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR, { recursive: true });

export const getImagePath = (filename: string) => {
  return path.join(FULL_DIR, `${filename}.jpg`);
};

export const resizeImage = async (
  filename: string,
  width: number,
  height: number
) => {
  // Validate all parameters
  validateImageParams(filename, width, height);

  const fullPath = getImagePath(filename);

  // Check if original file exists
  if (!fs.existsSync(fullPath)) {
    throw new ImageServiceError("Original file not found", "FILE_NOT_FOUND");
  }

  const thumbName = `${width}x${height}-${filename}.jpg`;
  const thumbPath = path.join(THUMB_DIR, thumbName);

  // Serve cached thumbnail if exists
  if (fs.existsSync(thumbPath)) {
    try {
      return await fs.promises.readFile(thumbPath);
    } catch {
      throw new ImageServiceError(
        "Error reading cached thumbnail",
        "READ_ERROR"
      );
    }
  }

  // Resize original image
  try {
    const buffer = await sharp(fullPath)
      .resize(width, height)
      .jpeg()
      .toBuffer();
    await fs.promises.writeFile(thumbPath, buffer);
    return buffer;
  } catch {
    throw new ImageServiceError("Image processing failed", "PROCESSING_ERROR");
  }
};
