import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { dummyBookingData } from "../assets/assets";
import { Clock, Ticket, MapPin, Calendar, ArrowRight, X } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const location = useLocation();

  const { axios, getToken, user, image_base_url } = useAppContext()
  const [bookings, setBookings] = useState([]);
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const getMyBookings = async () => {
   try{
    // Get paid bookings
    const{data}=await axios.get(`/api/user/bookings`,
       { headers: { Authorization: `Bearer ${await getToken()}` } 
    })
    if(data.success){
      setBookings(data.bookings)
    }

    // Get unpaid bookings
    const unpaidData = await axios.get(`/api/user/unpaid-bookings`,
       { headers: { Authorization: `Bearer ${await getToken()}` } 
    })
    if(unpaidData.data.success){
      setUnpaidBookings(unpaidData.data.bookings)
    }
   }catch(error){
console.log(error)
   }
   setIsLoading(false)
  }

  const cancelBooking = async (bookingId) => {
    // Show custom confirmation modal
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  }

  const confirmCancelBooking = async () => {
    try {
      const { data } = await axios.delete(`/api/user/cancel-booking/${bookingToCancel}`,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      
      if (data.success) {
        toast.success('Booking cancelled successfully');
        // Refresh bookings to remove the cancelled booking
        getMyBookings();
        // Close modal
        setShowCancelModal(false);
        setBookingToCancel(null);
      } else {
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }

  // Function to calculate remaining time
  const getRemainingTime = (createdAt) => {
    const bookingTime = new Date(createdAt);
    const expirationTime = new Date(bookingTime.getTime() + 10 * 60 * 1000); // 10 minutes
    const remaining = expirationTime - currentTime;
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return { minutes, seconds };
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time countdown

    return () => clearInterval(timer);
  }, []);

  // Check for expired bookings every minute
  useEffect(() => {
    const checkExpiredBookings = setInterval(() => {
      if (user && unpaidBookings.length > 0) {
        getMyBookings();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkExpiredBookings);
  }, [user, unpaidBookings.length]);
  useEffect(() => {
    if(user){
      getMyBookings()
    }
  }, [user]);

  // Check if user returned from successful payment
  useEffect(() => {
    if (location.state?.paymentSuccess) {
      toast.success('Payment completed successfully!');
      // Refresh bookings to show updated payment status
      getMyBookings();
      // Clear the state to prevent showing toast again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);


  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings  </h1>
      
      {/* Unpaid Bookings Section */}
      {unpaidBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-md font-medium mb-3 text-orange-400">⏰ Pending Payment (Complete within 10 minutes)</h2>
          {unpaidBookings.map((item,index)=>(
            <div key={`unpaid-${index}`} className="flex flex-col md:dflex-row justify-between bg-orange-500/10 border border-orange-500/30 rounded-lg mt-4 p-2 max-w-3xl">
              <div className="flex flex-col md:flex-row">
                <img src={ image_base_url + item.show.movie.poster_path} alt="" className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"/>
                <div className="flex flex-col p-4">
                  <p className="text-lg font-semibold">{item.show.movie.title}</p>
                  <p className="text-gray-400 text-sm">{timeFormat(item.show.movie.runtime)}</p>
                  <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4 mb-3">
                  <p className="text-2xl font-semibold">{currency}{item.amount}</p>
                  {(() => {
                    const remainingTime = getRemainingTime(item.createdAt);
                    return remainingTime ? (
                      <div className="text-right">
                        <p className="text-xs text-orange-400 font-medium">Expires in:</p>
                        <p className="text-sm font-bold text-orange-300">
                          {remainingTime.minutes}:{remainingTime.seconds.toString().padStart(2, '0')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-red-400 font-medium">Expired</p>
                    );
                  })()}
                </div>
                <div className="flex gap-2 mb-3">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 px-4 py-1 text-sm rounded-full font-medium cursor-pointer transition"
                    onClick={() =>
                      navigate('/payment', {
                        state: {
                          movieName: item.show.movie.title,
                          amount: item.amount,
                          bookingId: item._id,
                        },
                      })
                    }
                  >
                    Pay Now
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-4 py-1 text-sm rounded-full font-medium cursor-pointer transition"
                    onClick={() => cancelBooking(item._id)}
                  >
                    Cancel Booking
                  </button>
                </div>
                <div className="text-sm">
                  <p><span className="text-gray-400">Total Ticket : </span> {item.bookedSeats.length}</p>
                  <p><span className="text-gray-400">Seat Number : </span> {item.bookedSeats.join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paid Bookings Section */}
      {bookings.length > 0 && (
        <div>
          <h2 className="text-md font-medium mb-3 text-green-400">✅ Confirmed Bookings</h2>
          {bookings.map((item,index)=>(
            <div key={index} className="flex flex-col md:dflex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl">
              <div className="flex flex-col md:flex-row">
                <img src={ image_base_url + item.show.movie.poster_path} alt="" className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"/>
                <div className="flex flex-col p-4">
                  <p className="text-lg font-semibold">{item.show.movie.title}</p>
                  <p className="text-gray-400 text-sm">{timeFormat(item.show.movie.runtime)}</p>
                  <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <p className="text-2xl font-semibold mb-3">{currency}{item.amount}</p>
                <div className="text-sm">
                  <p><span className="text-gray-400" >Total Ticket : </span> {item.bookedSeats.length}</p>
                  <p><span className="text-gray-400" >Seat Number : </span> {item.bookedSeats.join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookings.length === 0 && unpaidBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">You don't have any bookings yet.</p>
          <button 
            onClick={() => navigate('/movies')}
            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dull rounded-full font-medium cursor-pointer transition"
          >
            Browse Movies
          </button>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Cancel Booking</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to cancel this booking?
              </p>
              <p className="text-gray-400 text-sm">
                This action cannot be undone and the seats will be released for other customers.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  ) : <Loading />
}

export default MyBookings;
