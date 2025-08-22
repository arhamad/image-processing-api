import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../../index";

describe("GET /images API", () => {
  const filename = "fjord";
  const width = 100;
  const height = 100;
  const thumbPath = path.join(
    __dirname,
    "../../../assets/thumb",
    `${width}x${height}-${filename}.jpg`
  );

  beforeAll(() => {
    // Clean up previous test thumbnail
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
  });

  it("should return 400 if any parameter is missing", async () => {
    const res = await request(app).get("/images?filename=fjord&width=100");
    expect(res.status).toEqual(400);
  });

  it("should resize original image and create thumbnail if not exist", async () => {
    const res = await request(app).get(
      `/images?filename=${filename}&width=${width}&height=${height}`
    );
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toEqual("image/jpeg");
    expect(fs.existsSync(thumbPath)).toEqual(true); // thumbnail created
  });

  it("should serve cached thumbnail if it already exists", async () => {
    // Modify thumbnail to test if API serves cached version
    const fakeContent = Buffer.from("cached test");
    fs.writeFileSync(thumbPath, fakeContent);

    const res = await request(app).get(
      `/images?filename=${filename}&width=${width}&height=${height}`
    );
    expect(res.status).toEqual(200);
    expect(res.body.toString()).toEqual("cached test"); // served cached content
  });

  it("should return 404 if original image does not exist", async () => {
    const res = await request(app).get(
      "/images?filename=nonexistent&width=100&height=100"
    );
    expect(res.status).toEqual(404);
  });

  afterAll(() => {
    // Clean up test thumbnail after all tests
    if (fs.existsSync(thumbPath)) {
      try {
        fs.unlinkSync(thumbPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});
