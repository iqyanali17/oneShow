
import React from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { useEffect, useState } from 'react';
import dateFormat from '../../lib/isoTimeFormat';


const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            setShows([{
                movie: dummyShowsData[0],
                showDateTime: "2025-11-30T02:30:00.000z",
                showprice: 59,
                occupiedSeats: {
                    A1: "user_1",
                    B1: "user_2",
                    C1: "user_3"

                }
            }]);
            setLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllShows()
    }, [])
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
                        {shows.map((show,index)=>(
                            <tr key={index} className=' bg-primary/10 border-b border-primary/10'>
                                <td className='py-2 min-w-45 pl-5'>{show.movie.title}</td>
                                <td className='py-2'>{show.showDateTime}</td>
                                <td className='py-2'>{dateFormat(show.showDateTime)}</td>
                                <td className='py-2'>{currency}{(show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0) * (show.showPrice || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    ) : <Loading />
}

export default ListShows