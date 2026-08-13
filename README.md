# 🏢 Student Connector & NexHostel

> **Enterprise Hostel, Mess & Accommodation Management Platform**

Student Connector (NexHostel) is a modern, full-stack enterprise web application designed to connect students with hostel accommodations and mess facilities. It simplifies accommodation management, room allocations, meal menus, complaint ticketing, real-time messaging, announcements, and payment processing for administrators, hostel managers, mess owners, and students.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Account & Profile Management**: Register, log in, and manage personal and academic details.
- **Hostel & Room Booking**: Search, inspect facilities, check availability, and request hostel room bookings.
- **Mess & Meal Management**: View daily/weekly menus, submit meal feedback, and manage mess subscriptions.
- **Real-Time Communication**: Chat directly with hostel and mess managers via Socket.io.
- **Support & Complaints**: Log maintenance or hostel complaints and track resolution status in real time.
- **Polls & Announcements**: Participate in student polls and stay updated with official announcements.

### 🏢 For Hostel & Mess Managers / Admins
- **Role-Based Access Control (RBAC)**: Secure access tailored for Admins, Hostel Managers, and Mess Owners.
- **Hostel & Structure Management**: Configure hostel layouts, floor plans, room capacities, and amenities.
- **Request Workflows**: Accept or reject student booking and mess connection requests.
- **Online Payments**: Integrated Razorpay payment gateway for fee collection and transaction tracking.
- **Background Processing**: Asynchronous job queuing with Bull.js and Redis for notifications and tasks.
- **Cloud Media Uploads**: Secure image archival and processing via Cloudinary integration.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, React Router DOM v7 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Sonner / React Toastify |
| **Backend Runtime** | Node.js (ES Modules), Express.js v5 |
| **Database & Cache** | MongoDB Atlas (Mongoose), Redis (Caching & Job Queue) |
| **Real-time & Queues** | Socket.io, Bull.js Message Queue |
| **Media & Payments** | Cloudinary API, Razorpay Payment SDK |
| **Authentication** | JWT (JSON Web Tokens), Cookie Parser, Bcrypt |

---

## 📁 Project Structure

```
project/
├── pro/                          # Backend Service (Node.js & Express)
│   ├── src/
│   │   ├── config/               # Redis & Bull Queue configurations
│   │   ├── controllers/          # Business logic & API request handlers
│   │   ├── db/                   # MongoDB connection client
│   │   ├── middleware/           # Auth, file upload (Multer), and validators
│   │   ├── models/               # Mongoose schemas (User, Hostel, Booking, Menu, etc.)
│   │   ├── routes/               # API route definitions
│   │   ├── utills/               # Cloudinary, Email, and helper utilities
│   │   └── validators/           # Express-validator schemas & Server Entry point
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── frontend/                     # Frontend Application (React & Vite)
│   ├── src/
│   │   ├── components/           # UI components (Hostel, Mess, Chat, Admin, etc.)
│   │   ├── pages/                # Application routes and views
│   │   └── utils/                # API client & helpers
│   ├── .env.example              # Frontend environment variables template
│   └── package.json
│
└── README.md                     # Project Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **Redis**: Local instance or Redis Cloud instance

---

### 1️⃣ Backend Setup (`/pro`)

1. **Navigate to backend directory**:
   ```bash
   cd pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   *Sample Backend `.env`:*
   ```env
   PORT=3000
   DB=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   ACCESS_TOKEN_SECRET="your_access_token_secret"
   ACCESS_TOKEN_EXPIRY="1d"
   REFRESH_TOKEN_SECRET="your_refresh_token_secret"
   REFRESH_TOKEN_EXPIRY="7d"

   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   REDIS_URL=redis://default:your_redis_password@your_redis_host:6379
   ```

4. **Start the Backend Development Server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

---

### 2️⃣ Frontend Setup (`/frontend`)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   *Sample Frontend `.env`:*
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

### Authentication & Users
- `POST /api/v1/users/register` - User registration (Student / Owner)
- `POST /api/v1/users/login` - Authenticate user & receive JWT token
- `POST /api/v1/users/logout` - Logout & clear token cookies

### Hostels & Structure
- `GET /api/v1/hostels` - List all available hostels
- `POST /api/v1/hostel-structure` - Configure hostel layout & rooms
- `POST /api/v1/hostels/request/:id` - Submit hostel join request

### Mess & Menus
- `GET /api/v1/menu` - Fetch daily/weekly mess menus
- `POST /api/v1/mess-requests` - Request mess subscription
- `POST /api/v1/meal-feedback` - Submit feedback on meals

### Complaints & Polls
- `GET /api/v1/complaints` - Fetch complaints
- `POST /api/v1/complaints` - Create a new support ticket
- `GET /api/v1/polls` - Active student polls
- `POST /api/v1/polls/vote` - Submit poll vote

---

## 🔒 Security Best Practices

- Never commit `.env` files containing real API secrets, MongoDB passwords, or JWT keys to version control.
- `.env` files are ignored by default in `.gitignore`.
- Use `.env.example` files to provide variable structure for new contributors.

---

## 📄 License

This project is licensed under the MIT License.
