import request from "supertest";
import app from "./server.js"; // Adjust path if needed

describe("GET /", () => {
  it("should return a valid response for an allowed URL", async () => {
    const res = await request(app).get("/?url=https://google.com");

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/https:\/\/google\.com is up\./);
  });

  it("should return an error for an invalid or unauthorized URL", async () => {
    const res = await request(app).get("/?url=http://localhost");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Invalid or unauthorized URL.");
  });

  it("should return a 400 error when no URL is provided", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(400);
    expect(res.text).toBe("URL query parameter is required.");
  });
});
