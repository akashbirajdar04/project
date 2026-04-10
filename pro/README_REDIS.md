# Redis Implementation Documentation

This document outlines exactly where and how Redis is implemented across the project, including the specific code snippets showing the implementation details.

## 1. Connection & Configuration
The core connections are established here before being exported to the rest of the application.

* **`src/config/redis.js`**
  * Initializes the primary `redisClient` using the standard `redis` npm package.
  * Connects using `process.env.REDIS_URL`.

```javascript
// src/config/redis.js
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
    url: redisUrl,
    socket: redisUrl.startsWith("rediss://") ? {
        tls: true,
        rejectUnauthorized: false
    } : undefined
});

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
```

---

## 2. API Rate Limiting (Security)
Redis is used as a highly optimized counter to protect the server from spam and abuse.

* **`src/controllers/ratelimit.js`**
  * Tracks user IPs via keys like `rate_limit:{ip}`.
  * Throws a `429 Too Many Requests` error if the limit is exceeded.

```javascript
// src/controllers/ratelimit.js
export default function RateLimiter(windowInSec, maxRequests) {
    return async (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'];
        const key = `rate_limit:${ip}`;

        try {
            const currentCount = await redisClient.get(key);
            if (currentCount && parseInt(currentCount) >= maxRequests) {
                return res.status(429).json({ success: false, message: "Too many requests" });
            }

            const newCount = await redisClient.incr(key);
            if (newCount === 1) {
                await redisClient.expire(key, windowInSec); // Reset timeframe
            }
            next();
        } catch (err) {
            next(); // Fail open if Redis is down
        }
    };
}
```

---

## 3. High-Performance Caching
Redis caches MongoDB interactions so repeated data fetches do not slow down the database.

* **Controllers Utilizing Cache:** `menu-controller.js`, `student-controller.js`, etc.
* **Implementation Details:** The controller first calls `await redisClient.get(cacheKey)`. If it misses, it fetches from DB and stores it with `redisClient.setEx()`.

```javascript
// src/controllers/menu-controller.js (Snippet)
export const getWeekMenu = async (req, res) => {
    // ... setup and ID validation ...

    // 1. Try to fetch from Redis explicitly
    let version = await redisClient.get(`menu_version_${messId}`) || "1";
    const cacheKey = `menu:mess:${messId}:v:${version}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        // Cache HIT: Return immediately without querying MongoDB
        console.log(`[Redis] Cache HIT for ${cacheKey}`);
        return res.json({ success: true, data: JSON.parse(cachedData) });
    }

    // 2. Cache MISS: Query MongoDB
    const docs = await Menu.find({ messId: messIdObj }).lean();
    
    // ... normalize maps ...

    // 3. Save to Redis Cache for future users (expires in 5 minutes)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(map));
    res.json({ success: true, data: map });
};
```

---

## 4. Background Queues & WebSockets (Bull)
Intensive background jobs are offloaded to Redis so they don't break the main API flow.

* **`src/config/queue.js`**
  * Configures `bull` (which uses `ioredis` internally) to create `notificationQueue`.

```javascript
// src/config/queue.js
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
```

* **`src/controllers/redisworker.js`**
  * Consumes payloads safely in the background.

```javascript
// src/controllers/redisworker.js (Snippet)
import { notificationQueue } from "../config/queue.js";

export const initWorker = (io) => {
    notificationQueue.process(async (job) => {
        const { type, scope, creatorId, title } = job.data;
        // 1. Fetch Recipients from DB
        // 2. Send Realtime WebSockets
        recipients.forEach((user) => {
            io.to(user._id.toString()).emit("receive_notification", {
                type: "info",
                message: `📢 New Announcement: ${title}`
            });
        });
    });
};
```
