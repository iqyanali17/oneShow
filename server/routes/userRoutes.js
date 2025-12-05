import express from "express";
import { getFavorites, getUserBookings, updateFavorite, getUnpaidBookings } from "../controllers/userController.js";


const userRouter=express.Router();

userRouter.get('/bookings',getUserBookings)
userRouter.get('/unpaid-bookings',getUnpaidBookings)
userRouter.post('/update-favorite',updateFavorite)
userRouter.get('/favorites',getFavorites)

export default userRouter;