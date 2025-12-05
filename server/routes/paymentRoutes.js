import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";

const router = express.Router();

// Initialize Razorpay only when needed and validate environment variables
const initializeRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured. Please check your .env file.');
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create an order for Razorpay Checkout
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "USD", movieName } = req.body;

    console.log('Payment request received:', { amount, currency, movieName });
    console.log('Razorpay keys available:', {
      key_id: !!process.env.RAZORPAY_KEY_ID,
      key_secret: !!process.env.RAZORPAY_KEY_SECRET
    });

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    let razorpay;
    try {
      razorpay = initializeRazorpay();
      console.log('Razorpay initialized successfully');
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        movieName: movieName || "Movie Ticket",
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // send public key to frontend
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
});

// Verify payment signature sent from frontend after successful payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key is not configured on the server",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Update booking payment status - you'll need to pass bookingId from frontend
      const { bookingId } = req.body;
      if (bookingId) {
        try {
          await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
          console.log(`Booking ${bookingId} marked as paid`);
        } catch (error) {
          console.error('Error updating booking payment status:', error);
        }
      }
      
      return res.json({ success: true, message: "Payment verified successfully" });
    }

    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
  }
});

export default router;
