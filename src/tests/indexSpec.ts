import request from "supertest";
import app from "../index"; // import the Express app

describe("Express App", () => {
  it("should return Help Message on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Use /images?filename=fjord&width=200&height=200");
  });
});
