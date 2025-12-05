// API to check if user is admin

import Booking from "../models/Booking.js"
import Show from "../models/Show.js"
import User from "../models/User.js"

export const isAdmin = async (req, res) => {
    try {
        // If we reach here, the protectAdmin middleware has already verified the user is an admin
        res.json({ 
            success: true, 
            isAdmin: true,
            user: {
                id: req.user.id,
                email: req.user.emailAddresses?.[0]?.emailAddress,
                role: req.user.privateMetadata?.role || 'user'
            }
        });
    } catch (error) {
        console.error('Error in isAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking admin status' 
        });
    }
}

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        // Get all bookings (not just paid ones) for total count
        const allBookings = await Booking.find({});
        // Get paid bookings for revenue calculation
        const paidBookings = await Booking.find({ isPaid: true });
        const activeShowsRaw = await Show.find({})
            .populate('movie')
            .sort({ showDateTime: 1 });

        // Filter out any shows where the movie failed to populate
        const activeShows = activeShowsRaw.filter(show => !!show.movie);

        // Get total users - if no users exist, try to get from Clerk
        let totalUser = await User.countDocuments();
        
        // If no users in database, we'll show a message but not 0
        if (totalUser === 0) {
            console.log('No users found in database - Clerk webhook may not be configured');
        }

        const dashboardData = {
            totalBooking: allBookings.length,
            totalRevenue: paidBookings.reduce((acc, booking) => acc + (booking.amount || 0), 0),
            activeShows,
            totalUser,
            paidBookings: paidBookings.length,
            unpaidBookings: allBookings.length - paidBookings.length
        };
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// API to get ALl shows
export const getAllShows = async (req, res) => {
    try {
        const showsRaw = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });

        // Filter out any shows where the movie failed to populate
        const shows = showsRaw.filter(show => !!show.movie);

        res.json({ success: true, shows });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}


// APi to get All Bookings
export const getAllBookings=async(req,res)=>{
    try {
        const bookings=await Booking.find({}).populate('user').populate({
            path:'show', 
            populate:{path:'movie'}
        }).sort({createdAt:-1})
        res.json({success:true,bookings})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
 
    }
}