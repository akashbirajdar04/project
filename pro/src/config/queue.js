import Queue from "bull";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const notificationQueue = new Queue("notification-queue", redisUrl, {
    redis: {
        ...(redisUrl.startsWith("rediss://") ? { tls: { rejectUnauthorized: false } } : {}),
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
            if (times > 3) {
                return null; // Stop reconnect retrying if Redis is unreachable
            }
            return Math.min(times * 1000, 3000);
        }
    }
});

notificationQueue.on('ready', () => {
    console.log('✅ Bull Queue (ioredis) connected to Redis successfully');
});

notificationQueue.on('error', (error) => {
    console.warn('⚠️ Bull Queue (ioredis) Warning:', error.message || error);
});
