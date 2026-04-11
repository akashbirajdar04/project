# Student Connector

A full-stack web application that connects students with hostels and mess facilities. Students can search, request, and connect with hostel/mess owners, while owners can manage their properties and accept/reject requests. The app includes real-time chat functionality for communication.

## Features

### For Students
- Register and login as a student
- Browse available hostels and mess facilities
- View detailed information about hostels/mess (facilities, ratings, contact, etc.)
- Send requests to join hostels/mess
- Real-time chat with hostel/mess owners
- Manage accepted requests and connections

### For Hostel Owners
- Register and manage hostel profiles
- Add detailed hostel information (facilities, amenities, room types, etc.)
- Receive and manage student requests
- Accept/reject requests
- Chat with accepted students

### For Mess Owners
- Register and manage mess profiles
- Add detailed mess information (menu, facilities, veg/non-veg options, etc.)
- Receive and manage student requests
- Accept/reject requests
- Chat with accepted students

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)
- Socket.io-client (real-time chat)
- Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- Bcrypt (password hashing)
- Socket.io (real-time chat)
- Nodemailer (email services)

## Project Structure

```
student-connector/
├── pro/ (Backend)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utills/
│   │   ├── validators/
│   │   └── db/
│   └── server.js
├── test/ (Frontend)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Backend Setup
1. Navigate to the `pro` directory:
   ```bash
   cd pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `pro` directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/student-connector
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `test` directory:
   ```bash
   cd test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/verify-email/:token` - Email verification

### Hostels
- `GET /api/v1/hostels` - Get all hostels
- `POST /api/v1/hostels/profile` - Update hostel profile
- `POST /api/v1/hostels/request/:id/:senderid` - Send request to hostel
- `GET /api/v1/hostels/requests/:id` - Get hostel requests

### Mess
- `POST /api/v1/mess/profile` - Update mess profile
- `GET /api/v1/mess/requests/:id` - Get mess requests

### Chat
- `POST /api/v1/chat/messages` - Get all messages between users

## Database Models

### User (Base Model)
- Discriminators: Student, Hostel Owner, Mess Owner
- Fields: username, email, password, role, avatar, etc.

### Student
- Additional fields: course, year, preferences, messid, hostelid

### Hostel Owner
- Additional fields: name, address, description, facilities, images, ratings, contact, availability, roomTypes, amenities, location, requesters, accepted

### Mess Owner
- Additional fields: name, address, description, facilities, menu, images, ratings, contact, vegNonVeg, priceRange, location, requesters, accepted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
