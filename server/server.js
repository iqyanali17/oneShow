import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express';
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/BookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = 3000;

await connectDB()

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())




// api routes
app.get('/', (req, res) => {
    res.send("Server is live. Check /api/db-status for database connection info.");
})

// Inngest webhook handler
app.use('/api/inngest', serve({ client: inngest, functions }));

// Other API routes
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})