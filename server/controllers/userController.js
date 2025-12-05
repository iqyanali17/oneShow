// Api Controller functions to get user bookings

import { clerkClient, getAuth } from "@clerk/express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const bookings = await Booking.find({ user: userId, isPaid: true }).populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API controller function to update favorite movies in Clerk user metadata

export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId);
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata });
        res.json({ success: true, message: "Favorite movies updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getUnpaidBookings = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        // First, remove expired bookings (older than 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        await Booking.deleteMany({
            user: userId,
            isPaid: false,
            createdAt: { $lt: tenMinutesAgo }
        });

        // Then get remaining unpaid bookings
        const bookings = await Booking.find({ user: userId, isPaid: false }).populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        // Getting movies from database
        const movies = await Movie.find({ _id: { $in: favorites } });
        res.json({ success: true, movies });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { bookingId } = req.params;
        
        // Find and delete the booking
        const booking = await Booking.findOneAndDelete({ 
            _id: bookingId, 
            user: userId, 
            isPaid: false 
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found or already paid" });
        }

        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
