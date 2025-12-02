import mongoose from "mongoose";

const bookingScehema=new mongoose.Schema({
    user:{type:String,required:true,ref:"User"},
    show:{type:String,requied:true,ref:'Show'},
    amount:{type:Number,required:true},
    bookedSeats:{type:Array,required:true},
    isPaid:{type:Boolean,default:false},
    paymentLink:{type:String},
},{timestamps:true})

const Booking=mongoose.model("Booking",bookingScehema);

export default Booking;