import Queue from "bull";

export const notificationQueue = new Queue("notification-queue", {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
});
