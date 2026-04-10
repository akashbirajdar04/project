import Queue from "bull";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const notificationQueue = new Queue("notification-queue", redisUrl, {
    redis: redisUrl.startsWith("rediss://") ? {
        tls: { rejectUnauthorized: false }
    } : {}
});

notificationQueue.on('ready', () => {
    console.log('✅ Bull Queue (ioredis) connected to Redis successfully');
});

notificationQueue.on('error', (error) => {
    console.error('❌ Bull Queue (ioredis) Error:', error);
});
