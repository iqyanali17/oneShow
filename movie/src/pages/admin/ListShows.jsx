
import React from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { useEffect, useState } from 'react';
import dateFormat from '../../lib/isoTimeFormat';
import { useAppContext } from '../../context/appContext';


const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY

     const { axios, getToken, user } = useAppContext()

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
          const {data }=await axios.get("/api/admin/all-shows",{
            headers:{Authorization:`Bearer ${await getToken()}`}
          })
          setShows(data.shows)
            setLoading(false);
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if(user){
            getAllShows();
        }
    }, [user])
    return !loading ? (
        <>
            <Title text1="List" text2="List Shows" />
            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-wrap'>
                    <thead>
                        <tr className='bg-primary/30 text-left text-white'>
                        <th className='py-2 font-medium'>Movie Name</th>
                        <th className='py-2 font-medium'>Show Time</th>
                        <th className='py-2 font-medium'>Total Booking</th>
                        <th className='py-2 font-medium'>Earnings</th>              
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {shows.map((show,index)=>{
                            const movie = show.movie || {};
                            const bookingCount = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;
                            const earnings = bookingCount * (show.showPrice || 0);
                            return (
                                <tr key={index} className=' bg-primary/10 border-b border-primary/10'>
                                    <td className='py-2 min-w-45 pl-5'>{movie.title || 'Unknown movie'}</td>
                                    <td className='py-2'>{dateFormat(show.showDateTime)}</td>
                                    <td className='py-2'>{bookingCount}</td>
                                    <td className='py-2'>{currency}{earnings}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
        </>
    ) : <Loading />
}

export default ListShows