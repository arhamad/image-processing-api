import request from "supertest";
import app from "../../index";
import * as service from "../../services/imageService";
import { ImageServiceError } from "../../utils/validation";

describe("Image Controller", () => {
  let originalResizeImage: typeof service.resizeImage;

  beforeEach(() => {
    originalResizeImage = service.resizeImage;
  });

  afterEach(() => {
    (
      service as unknown as { resizeImage: typeof service.resizeImage }
    ).resizeImage = originalResizeImage;
  });

  describe("successful requests", () => {
    it("should return image buffer", async () => {
      spyOn(service, "resizeImage").and.returnValue(
        Promise.resolve(Buffer.from("test"))
      );

      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=100"
      );

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(jasmine.any(Buffer));
      expect(service.resizeImage).toHaveBeenCalledWith("fjord", 100, 100);
    });
  });

  describe("missing parameters", () => {
    it("should return 400 if all parameters missing", async () => {
      const res = await request(app).get("/images");
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Missing required parameters");
    });

    it("should return 400 if filename missing", async () => {
      const res = await request(app).get("/images?width=100&height=100");
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Missing required parameters");
    });

    it("should return 400 if width missing", async () => {
      const res = await request(app).get("/images?filename=fjord&height=100");
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Missing required parameters");
    });

    it("should return 400 if height missing", async () => {
      const res = await request(app).get("/images?filename=fjord&width=100");
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Missing required parameters");
    });
  });

  describe("invalid filename", () => {
    it("should return 400 for filename with special characters", async () => {
      const res = await request(app).get(
        "/images?filename=test.jpg&width=100&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid filename");
    });

    it("should return 400 for path traversal attempt", async () => {
      const res = await request(app).get(
        "/images?filename=../test&width=100&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid filename");
    });

    it("should return 400 for filename with spaces", async () => {
      const res = await request(app).get(
        "/images?filename=test image&width=100&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid filename");
    });
  });

  describe("invalid dimensions", () => {
    it("should return 400 for negative width", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=-100&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid width");
    });

    it("should return 400 for zero width", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=0&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid width");
    });

    it("should return 400 for width too large", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=5001&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid width");
    });

    it("should return 400 for negative height", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=-100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid height");
    });

    it("should return 400 for non-numeric width", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=abc&height=100"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid width");
    });

    it("should return 400 for non-numeric height", async () => {
      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=abc"
      );
      expect(res.status).toEqual(400);
      expect(res.body.error).toContain("Invalid height");
    });
  });

  describe("service errors", () => {
    it("should return 404 for file not found", async () => {
      spyOn(service, "resizeImage").and.throwError(
        new ImageServiceError("Original file not found", "FILE_NOT_FOUND")
      );

      const res = await request(app).get(
        "/images?filename=nonexistent&width=100&height=100"
      );
      expect(res.status).toEqual(404);
      expect(res.body.error).toBe("Image not found");
    });

    it("should return 422 for processing error", async () => {
      spyOn(service, "resizeImage").and.throwError(
        new ImageServiceError("Image processing failed", "PROCESSING_ERROR")
      );

      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=100"
      );
      expect(res.status).toEqual(422);
      expect(res.body.error).toBe("Image processing failed");
    });

    it("should return 500 for read error", async () => {
      spyOn(service, "resizeImage").and.throwError(
        new ImageServiceError("Error reading cached thumbnail", "READ_ERROR")
      );

      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=100"
      );
      expect(res.status).toEqual(500);
      expect(res.body.error).toBe("Error accessing image file");
    });

    it("should return 500 for unknown errors", async () => {
      spyOn(service, "resizeImage").and.throwError(new Error("Unknown error"));

      const res = await request(app).get(
        "/images?filename=fjord&width=100&height=100"
      );
      expect(res.status).toEqual(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});
