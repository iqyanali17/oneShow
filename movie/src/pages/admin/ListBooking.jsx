import React, { useState, useEffect } from 'react'
import Loading from '../../components/Loading';
import { dummyBookingData } from '../../assets/assets';
import dateFormat from '../../lib/isoTimeFormat';
import { useAppContext } from '../../context/appContext';


const ListBooking = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const { axios, getToken, user } = useAppContext()

    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getAllBookings = async () => {
        try {
            const { data } = await axios.get("/api/admin/all-bookings", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setBookings(data.bookings)
        } catch (error) {
console.log(error)
        }
        setIsLoading(false)
    };
    useEffect(() => {
        if(user){
  getAllBookings();
        }
      
    }, [user])
    return !isLoading ? (
        <>
            <title text1="List" text2="Booking" />
            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/30 text-left text-white'>
                            <th className='py-2 font-medium'>User Name</th>
                            <th className='py-2 font-medium'>Movie Name</th>
                            <th className='py-2 font-medium'>Show Time</th>
                            <th className='py-2 font-medium'>Seats</th>
                            <th className='py-2 font-medium'>Amounts</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {bookings.map((item, index) => (
                            <tr key={index} className=' border-primary/10 border-b bg-primary/5 even:bg-primary/10'>
                                <td className='py-2 min-w-45 pl-5'>{item.user.name}</td>
                                <td className='py-2'>{item.show.movie.title}</td>
                                <td className='py-2'>{dateFormat(item.show.showDateTime)}</td>
                                <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                                <td className='py-2'>{currency}{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
};
export default ListBooking