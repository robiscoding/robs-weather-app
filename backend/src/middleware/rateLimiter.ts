import rateLimit from "express-rate-limit";

export function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests, please try again later.",
  standardHeaders = true,
  ipv6Subnet = 60,
}: {
  windowMs?: number;
  max?: number;
  message?: string;
  standardHeaders?: boolean;
  ipv6Subnet?: number;
}) {
  return rateLimit({ windowMs, max, message, standardHeaders, ipv6Subnet });
}
