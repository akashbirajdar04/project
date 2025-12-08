# System Performance Documentation

## 1. Architecture Overview

The system utilizes a modern MEAN/MERN-style architecture designed for campus management. Key performance-critical components include:

-   **Database**: MongoDB (Mongoose ODM)
    -   Stores relational data for Students, Messes, and Hostels.
    -   Heavily relies on array-based relationships (e.g., `accepted` arrays in Mess/Hostel models).
-   **Job Queue**: Redis & Bull
    -   Handles background processing for announcements to prevent blocking the main thread.
-   **Real-time Layer**: Socket.IO
    -   Delivers instant notifications to connected clients.

## 2. Load Testing & Seeding

The project includes a substantial load testing script located at `pro/seed-10k.js`.

### Purpose
To simulate a high-load environment by injecting **10,000 student records** into the system. This allows developers to test:
-   Database query performance with large collections.
-   UI rendering performance (pagination, endless scrolling).
-   Notification delivery latency.

### How to Run
```bash
cd pro
node seed-10k.js
```

### Script Behavior
1.  **Connects to DB**: Uses `MONGODB_URI` from env or defaults to local.
2.  **Identifies Targets**: Finds "Mess A" and "Hostel X" by hardcoded emails.
3.  **Batch Insertion**: Generates students in batches of **1000**.
4.  **Relationship Update**: Updates the target Mess and Hostel `accepted` arrays.

> [!WARNING]
> **Performance Impact**: The seeding script pushes 10,000 IDs into a single array (`accepted`) on the Mess and Hostel documents. This creates a "Large Document" issue in MongoDB, which can significantly slow down `findOne` or `findById` queries for those owners.

## 3. Performance Bottlenecks & Analysis

### A. Data Modeling (Unbounded Arrays)
**Location**: `pro/seed-10k.js` (Lines 68-71) & User Models
-   **Issue**: Storing all student IDs in a single `accepted` array on Mess/Hostel documents.
-   **Impact**: MongoDB documents have a 16MB limit. While IDs are small, processing 10k+ items in an array for every read operation is inefficient and CPU intensive.
-   **Recommendation**: Switch to a "Parent-referencing" model logic where the `Student` model stores the `messId` (already present) and queries are done via `Student.find({ messid: ownerId })` instead of loading the Owner's array.

### B. Notification Broadcast Loop
**Location**: `pro/src/controllers/redisworker.js` (Lines 45-52)
-   **Issue**: The worker fetches **all** recipients (potentially 10,000+) into memory and iterates through them synchronously to emit Socket.IO events.
    ```javascript
    recipients.forEach((user) => {
        io.to(user._id.toString()).emit(...);
    });
    ```
-   **Impact**:
    -   **High Memory Usage**: Loading 10k objects into RAM.
    -   **Event Loop Blocking**: The synchronous `forEach` can block the Node.js event loop, delaying other operations.
-   **Recommendation**:
    -   Use **Cursor-based iteration** to process users in chunks.
    -   Consider broadcasting to a generic "Room" (e.g., `io.to("mess_A").emit(...)`) instead of individual socket emissions if the message is identical for all users in that scope.

## 4. Optimization Roadmap

| Priority | Component | Action Item |
| :--- | :--- | :--- |
| 🔴 High | Database Schema | Deprecate `accepted` array in Mess/Hostel models; rely on indexed queries on Student model. |
| 🟡 Medium | Notification Worker | Implement chunked processing for fetching recipients. |
| 🟡 Medium | Notification Worker | Switch to Room-based Socket.IO broadcasting for "Global", "Mess", and "Hostel" scopes. |
| 🟢 Low | Seeding Script | Add option to specify custom batch sizes or target counts via CLI arguments. |
