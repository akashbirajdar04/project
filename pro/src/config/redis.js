import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
    url: redisUrl,
    socket: {
        ...(redisUrl.startsWith("rediss://") ? { tls: true, rejectUnauthorized: false } : {}),
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.warn("⚠️ Redis reconnect retries exceeded limit. Operating without Redis caching.");
                return new Error("Redis connection retry limit reached");
            }
            return Math.min(retries * 500, 2000);
        }
    }
});

redisClient.on("error", (err) => {
    // Log concisely without throwing unhandled exceptions
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
        // Log once per connection attempt
    } else {
        console.error("Redis Client Error:", err.message);
    }
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("✅ Redis connected");
        }
    } catch (err) {
        console.warn("⚠️ Failed to connect to Redis server. App running in non-cached mode:", err.message);
    }
};
