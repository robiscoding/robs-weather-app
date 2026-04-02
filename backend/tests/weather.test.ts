import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { MockLocationProvider } from "../src/services/location/providers/MockLocationProvider.js";
import { MockWeatherProvider } from "../src/services/weather/providers/MockWeatherProvider.js";

describe("GET /api/weather", () => {
  const provider = new MockWeatherProvider();
  const app = createApp(provider, new MockLocationProvider());

  describe("validation", () => {
    it("returns 400 when lat and lon are missing", async () => {
      const res = await request(app).get("/api/weather");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when lat is missing", async () => {
      const res = await request(app).get("/api/weather?lon=-78.6382");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when lon is missing", async () => {
      const res = await request(app).get("/api/weather?lat=35.7796");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when units is invalid", async () => {
      const res = await request(app).get(
        "/api/weather?lat=35.7796&lon=-78.6382&units=nope",
      );
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("successful response", () => {
    const coords = { lat: 35.7796, lon: -78.6382 };

    it("returns 200 for valid coordinates", async () => {
      const res = await request(app).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.status).toBe(200);
    });

    it("returns the correct GetWeatherResponse shape", async () => {
      const res = await request(app).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.body).toEqual({
        data: {
          timestamp: expect.any(String),
          location: coords,
          units: "metric",
          condition: { code: expect.any(Number), label: expect.any(String) },
          temp: expect.any(Number),
          feels_like: expect.any(Number),
          temp_min: expect.any(Number),
          temp_max: expect.any(Number),
          humidity: expect.any(Number),
          visibility: expect.any(Number),
          wind: {
            speed: expect.any(Number),
            deg: expect.any(Number),
            gust: expect.any(Number),
          },
        },
      });
    });

    it("returns an ISO timestamp", async () => {
      const res = await request(app).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(new Date(res.body.data.timestamp).toISOString()).toBe(
        res.body.data.timestamp,
      );
    });

    it("echoes the requested coordinates in location", async () => {
      const res = await request(app).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.body.data.location).toEqual(coords);
    });

    it("returns units from the units query param when provided", async () => {
      const res = await request(app).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial`,
      );
      expect(res.status).toBe(200);
      expect(res.body.data.units).toBe("imperial");
    });

    it("returns 200 for boundary coordinates (0, 0)", async () => {
      const res = await request(app).get("/api/weather?lat=0&lon=0");
      expect(res.status).toBe(200);
      expect(res.body.data.location).toEqual({ lat: 0, lon: 0 });
    });

    it("reflects overrides passed to MockWeatherProvider", async () => {
      const overriddenApp = createApp(
        new MockWeatherProvider({ temp: 55, units: "metric" }),
        new MockLocationProvider(),
      );
      const res = await request(overriddenApp).get(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );
      expect(res.body.data.temp).toBe(55);
      expect(res.body.data.units).toBe("metric");
    });
  });
});
