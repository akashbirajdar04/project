import { redisClient } from "../config/redis.js";

export default function RateLimiter(windowInSec, maxRequests) {
    return async (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const key = `rate_limit:${ip}`;

        try {
            if (!ip) return res.status(400).json({ success: false, message: "Invalid request IP" });

            const currentCount = await redisClient.get(key);

            if (currentCount && parseInt(currentCount) >= maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later."
                });
            }

            // Increment count
            const newCount = await redisClient.incr(key);

            // If it's the first request (count is 1), set expiration
            if (newCount === 1) {
                await redisClient.expire(key, windowInSec);
            }

            next();
        } catch (err) {
            console.error("Rate limiter error:", err);
            // Fail open: allow request if Redis fails
            next();
        }
    };
}