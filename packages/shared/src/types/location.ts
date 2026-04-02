import { z } from "zod";

export const locationResultSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  display_name: z.string(),
});

export const searchLocationRequestSchema = z.object({
  q: z.string().min(1),
});

export const searchLocationResponseSchema = z.object({
  data: locationResultSchema,
});

export const reverseGeocodeRequestSchema = z.object({
  lat: z.string(),
  lon: z.string(),
});

export const reverseGeocodeResponseSchema = z.object({
  data: locationResultSchema,
});

export type LocationResult = z.infer<typeof locationResultSchema>;
export type SearchLocationRequest = z.infer<typeof searchLocationRequestSchema>;
export type SearchLocationResponse = z.infer<typeof searchLocationResponseSchema>;
export type ReverseGeocodeRequest = z.infer<typeof reverseGeocodeRequestSchema>;
export type ReverseGeocodeResponse = z.infer<typeof reverseGeocodeResponseSchema>;
