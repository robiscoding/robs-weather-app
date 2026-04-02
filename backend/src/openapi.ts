import "zod-openapi";
import { createDocument } from "zod-openapi";
import {
  errorResponseSchema,
  getWeatherRequestSchema,
  getWeatherResponseSchema,
  reverseGeocodeRequestSchema,
  reverseGeocodeResponseSchema,
  searchLocationRequestSchema,
  searchLocationResponseSchema,
} from "@palmetto/shared";

export const openApiDocument: ReturnType<typeof createDocument> = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Palmetto Weather API",
    version: "1.0.0",
  },
  paths: {
    "/api/weather": {
      get: {
        summary: "Get current weather by coordinates",
        requestParams: { query: getWeatherRequestSchema },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: getWeatherResponseSchema },
            },
          },
          "400": {
            description: "400 Bad Request",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "500": {
            description: "500 Internal Server Error",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/location/search": {
      get: {
        summary: "Search for a location by name",
        requestParams: { query: searchLocationRequestSchema },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: searchLocationResponseSchema },
            },
          },
          "400": {
            description: "400 Bad Request",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "500": {
            description: "500 Internal Server Error",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
    "/api/location/reverse": {
      get: {
        summary: "Reverse geocode coordinates to a location",
        requestParams: { query: reverseGeocodeRequestSchema },
        responses: {
          "200": {
            description: "200 OK",
            content: {
              "application/json": { schema: reverseGeocodeResponseSchema },
            },
          },
          "400": {
            description: "400 Bad Request",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
          "500": {
            description: "500 Internal Server Error",
            content: {
              "application/json": { schema: errorResponseSchema },
            },
          },
        },
      },
    },
  },
});
