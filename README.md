# EventSphere - Discover & Book Amazing Events

EventSphere is a modern, high-performance event booking platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a sleek UI, real-time search, category filtering, secure payments via Razorpay, and digital ticket generation with QR codes.

## 🚀 Features

- **Dynamic Homepage**: Featured events, "How It Works" guide, and category-based exploration.
- **Advanced Search & Filter**: Search events by title, filter by category, price range, and date.
- **Secure Booking Flow**: Integrated with Razorpay for seamless payment processing.
- **My Bookings**: Manage your upcoming and past events, view digital tickets with unique QR codes.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop with dark mode support.
- **Admin Panel**: (Planned/Extended) Manage users, events, and view analytics.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, TanStack Query, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB (Atlas).
- **Payments**: Razorpay.
- **Auth**: JWT-based authentication.

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB account (or local installation)
- Razorpay account (for testing/production keys)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eventsphere
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Seed the database with sample events and users:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The application should now be running at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Demo Credentials

After seeding the database, you can use these accounts to explore the platform:

- **Admin User**:
  - Email: `admin@eventsphere.com`
  - Password: `admin123`
- **Regular User**:
  - Email: `john@example.com`
  - Password: `user123`

---

## 🛠️ Recent Improvements & Bug Fixes

- **QR Code Fix**: Resolved `RangeError: Data too long` by rendering pre-generated QR Data URLs directly as images.
- **My Bookings Refresh**: Implemented query invalidation to ensure new bookings appear immediately after payment without manual refresh.
- **UI Contrast**: Improved visibility of step numbers and labels in both light and dark modes.
- **Category Sync**: Fixed navigation issue where footer category links wouldn't update the event list dynamically.
- **Null Safety**: Added guards for bookings where event data might be missing or deleted.
