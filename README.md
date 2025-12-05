# oneShow - Movie Ticket Booking System

A full-stack movie ticket booking application built with React, Node.js, and MongoDB, featuring user authentication, payment integration, and admin dashboard.

## 🎬 Features

### User Features
- **Browse Movies**: View now-playing movies with details, ratings, and cast information
- **Book Tickets**: Select show times, choose seats, and book tickets
- **Payment Integration**: Secure payment processing with Razorpay
- **My Bookings**: View and manage booked tickets with payment status
- **User Authentication**: Secure login/signup with Clerk
- **Favorites**: Add/remove movies from favorites list

### Admin Features
- **Dashboard**: Overview of total bookings, revenue, and users
- **Movie Management**: Add and manage movie shows
- **Booking Management**: View all user bookings and details
- **Show Management**: Create and manage movie showtimes
- **Revenue Tracking**: Monitor earnings and booking statistics

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Clerk** - Authentication
- **Razorpay** - Payment processing
- **Inngest** - Webhook functions

### Development Tools
- **Vite** - Build tool
- **Nodemon** - Development server
- **ESLint** - Code linting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Clerk account for authentication
- Razorpay account for payments
- TMDB API key for movie data

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/iqyanali17/oneShow.git
cd oneShow
```

### 2. Install Dependencies

#### Frontend
```bash
cd movie
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Environment Setup

#### Backend Environment (.env)
Create `.env` file in `server/` directory:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/movie-ticket

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Razorpay Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# TMDB API
TMDB_API_KEY=your_tmdb_api_key

# Server
PORT=3000
NODE_ENV=development
```

#### Frontend Environment (.env)
Create `.env` file in `movie/` directory:
```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

### 4. Database Setup
- Ensure MongoDB is running on your system
- Create a database named `movie-ticket`
- The application will automatically create collections

### 5. Clerk Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys
4. Configure webhook endpoints for user sync
5. Add admin role to user metadata for admin access

### 6. Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add keys to your environment variables

### 7. TMDB API Setup
1. Create an account at [themoviedb.org](https://themoviedb.org)
2. Get your API key from settings
3. Add key to environment variables

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd server
npm run server
```
Server will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd movie
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
oneShow/
├── movie/                     # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/         # React context
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   └── ...          # User pages
│   │   └── assets/          # Static assets and dummy data
│   ├── package.json
│   └── vite.config.js
├── server/                   # Backend Node.js application
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── inngest/             # Webhook functions
│   ├── config/              # Configuration files
│   ├── package.json
│   └── server.js            # Server entry point
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `GET /api/admin/is-admin` - Check admin status
- Webhook endpoints for Clerk user sync

### Movies
- `GET /api/show/now-playing` - Get now playing movies
- `GET /api/show/:id` - Get movie details
- `POST /api/show/add` - Add new show (admin)

### Bookings
- `POST /api/booking/create` - Create booking
- `GET /api/booking/seats/:showId` - Get occupied seats
- `GET /api/admin/all-bookings` - Get all bookings (admin)

### Payments
- `POST /api/payment/orders` - Create payment order
- `POST /api/payment/verify` - Verify payment

### Users
- `POST /api/user/update-favorite` - Update favorite movies

## 🎯 Key Features Implementation

### Payment Flow
1. User selects seats and proceeds to checkout
2. Payment page creates Razorpay order
3. User completes payment via Razorpay
4. Payment verification updates booking status
5. User redirected to My Bookings with success message

### Admin Authentication
- Supports both Clerk session cookies and Bearer tokens
- Admin role checked via Clerk private metadata
- Protected routes for admin-only access

### Real-time Updates
- Webhook functions sync Clerk users to database
- Automatic user creation/update on authentication events

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Clerk Authentication Issues**
   - Verify Clerk keys in environment variables
   - Check webhook configuration

3. **Payment Errors**
   - Verify Razorpay keys
   - Check payment webhook setup

4. **Movie Data Not Loading**
   - Verify TMDB API key
   - Check network connectivity

5. **Build Errors**
   - Clear node_modules and reinstall
   - Check for missing environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **iqyanali17** - *Initial work* - [GitHub Profile](https://github.com/iqyanali17)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data API
- [Clerk](https://clerk.com/) for authentication services
- [Razorpay](https://razorpay.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the project maintainer.

---

**Note**: This is a development project. For production use, ensure proper security measures, environment configuration, and testing.