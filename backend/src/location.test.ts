import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { MockLocationProvider } from "./services/location/providers/MockLocationProvider.js";
import { MockWeatherProvider } from "./services/weather/providers/MockWeatherProvider.js";

const app = createApp(new MockWeatherProvider(), new MockLocationProvider());

describe("GET /api/location/search", () => {
  describe("validation", () => {
    it("returns 400 when q is missing", async () => {
      const res = await request(app).get("/api/location/search");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when q is an empty string", async () => {
      const res = await request(app).get("/api/location/search?q=");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("successful response", () => {
    it("returns the correct SearchLocationResponse shape", async () => {
      const res = await request(app).get(
        "/api/location/search?q=Charlotte%2C+NC",
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        data: {
          lat: 35.7796,
          lon: -78.6382,
          display_name: "Charlotte, NC",
        },
      });
    });

    it("returns lat and lon as numbers, not strings", async () => {
      const res = await request(app).get(
        "/api/location/search?q=Charlotte%2C+NC",
      );
      expect(res.body.data.lat).toBe(35.7796);
      expect(res.body.data.lon).toBe(-78.6382);
    });

    it("reflects overrides passed to MockLocationProvider", async () => {
      const overriddenApp = createApp(
        new MockWeatherProvider(),
        new MockLocationProvider({
          display_name: "Raleigh, North Carolina, United States",
        }),
      );
      const res = await request(overriddenApp).get(
        "/api/location/search?q=Raleigh%2C+NC",
      );
      expect(res.body.data.display_name).toBe(
        "Raleigh, North Carolina, United States",
      );
    });

    it("accepts a free-form multi-word query", async () => {
      const res = await request(app).get(
        `/api/location/search?q=${encodeURIComponent("28201")}`,
      );
      expect(res.status).toBe(200);
    });
  });
});

describe("GET /api/location/reverse", () => {
  const coords = { lat: 35.7796, lon: -78.6382 };

  describe("validation", () => {
    it("returns 400 when lat and lon are missing", async () => {
      const res = await request(app).get("/api/location/reverse");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when lat is missing", async () => {
      const res = await request(app).get(
        `/api/location/reverse?lon=${coords.lon}`,
      );
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when lon is missing", async () => {
      const res = await request(app).get(
        `/api/location/reverse?lat=${coords.lat}`,
      );
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("successful response", () => {
    it("returns 200 for valid coordinates", async () => {
      const res = await request(app).get(
        `/api/location/reverse?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.status).toBe(200);
    });

    it("returns the correct ReverseGeocodeResponse shape", async () => {
      const res = await request(app).get(
        `/api/location/reverse?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.body).toEqual({
        data: {
          lat: expect.any(Number),
          lon: expect.any(Number),
          display_name: expect.any(String),
        },
      });
    });

    it("returns 200 for boundary coordinates (0, 0)", async () => {
      const res = await request(app).get("/api/location/reverse?lat=0&lon=0");
      expect(res.status).toBe(200);
    });

    it("reflects overrides passed to MockLocationProvider", async () => {
      const overriddenApp = createApp(
        new MockWeatherProvider(),
        new MockLocationProvider({ display_name: "Null Island" }),
      );
      const res = await request(overriddenApp).get(
        "/api/location/reverse?lat=0&lon=0",
      );
      expect(res.body.data.display_name).toBe("Null Island");
    });
  });
});
