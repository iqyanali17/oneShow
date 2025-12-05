// Function to check seats availability of selected seats for a movie

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { getAuth } from '@clerk/express';

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats || {};
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;

    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        // Get authenticated user from Clerk
        const { userId } = getAuth(req);
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }


        // Basic validation
        if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.json({ success: false, message: "Missing or invalid booking data" })
        }

        // check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are not available." })
        }

        // Get the Show details
        const showData = await Show.findById(showId).populate('movie');
        if (!showData) {
            return res.json({ success: false, message: "Show not found" })
        }

        // create a new Booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();

        // Stripe Gateway initialize could go here
        res.json({ success: true, message: "To confirm seat please payment within 10 min", booking })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

 export const getOccupiedSeats=async(req,res)=>{
    try {
        const {showId}=req.params;
        const showData=await Show.findById(showId);
        const occupiedSeats=Object.keys(showData.occupiedSeats)
    
        res.json({success:true,occupiedSeats})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
 }