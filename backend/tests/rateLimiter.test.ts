import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../src/middleware/rateLimiter.js";

function buildApp(max: number, message?: string) {
  const app = express();
  app.use(createRateLimiter({ windowMs: 60_000, max, ...(message ? { message } : {}) }));
  app.get("/", (_req, res) => res.json({ ok: true }));
  return app;
}

describe("createRateLimiter", () => {
  it("allows requests under the limit", async () => {
    const app = buildApp(3);
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    }
  });

  it("returns 429 once the limit is exceeded", async () => {
    const app = buildApp(2);
    await request(app).get("/");
    await request(app).get("/");
    const res = await request(app).get("/");
    expect(res.status).toBe(429);
  });

  it("includes the custom message in the 429 response", async () => {
    const message = "Slow down!";
    const app = buildApp(1, message);
    await request(app).get("/");
    const res = await request(app).get("/");
    expect(res.status).toBe(429);
    expect(res.text).toContain(message);
  });

  it("includes RateLimit headers in successful responses when standardHeaders is true", async () => {
    const app = buildApp(5);
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty("ratelimit-limit");
    expect(res.headers).toHaveProperty("ratelimit-remaining");
  });

  it("decrements ratelimit-remaining with each request", async () => {
    const app = buildApp(5);
    const first = await request(app).get("/");
    const second = await request(app).get("/");
    expect(Number(second.headers["ratelimit-remaining"])).toBeLessThan(
      Number(first.headers["ratelimit-remaining"]),
    );
  });

  it("uses the default message when none is provided", async () => {
    const app = buildApp(1);
    await request(app).get("/");
    const res = await request(app).get("/");
    expect(res.status).toBe(429);
    expect(res.text).toContain("Too many requests");
  });
});
