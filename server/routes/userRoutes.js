import express from "express";
import { getFavorites, getUserBookings, updateFavorite, getUnpaidBookings, cancelBooking } from "../controllers/userController.js";


const userRouter=express.Router();

userRouter.get('/bookings',getUserBookings)
userRouter.get('/unpaid-bookings',getUnpaidBookings)
userRouter.post('/update-favorite',updateFavorite)
userRouter.get('/favorites',getFavorites)
userRouter.delete('/cancel-booking/:bookingId', cancelBooking)

export default userRouter;