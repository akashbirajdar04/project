import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
    url: redisUrl,
    socket: redisUrl.startsWith("rediss://") ? {
        tls: true,
        rejectUnauthorized: false
    } : undefined
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("✅ Redis connected");
        }
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
};
