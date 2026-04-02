import { z } from "zod";

export const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
