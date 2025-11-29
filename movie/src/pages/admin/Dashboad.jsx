import {  ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import BlurCircle from '../../components/BlurCircle';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/isoTimeFormat';
const Dashboad = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData, setDeshboardData] = useState({
        totalBooking: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    });
    const [loading, setLoading] = useState(true);
    const dashboadCards = [
        { title: "Title Booking", value: dashboardData.totalBooking || "0", icon: ChartLineIcon},
        { title: "Total Revenue", value: currency +  dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon},
        { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
        { title: " Users ", value: dashboardData.totalUser || "0", icon: UsersIcon }
    ]

    const fetchDashboardData = async () => {
        setDeshboardData(dummyDashboardData)
        setLoading(false)
    };
    useEffect(() => {
        fetchDashboardData();
    }, [])



    1
    return !loading ? (
        <>
 <Title text1="Admin"  text2="Dashboard"/>

 <div className='relative flex flex-wrap gap-4 mt-6'>
    <BlurCircle top="-100px" left="0"/>
    <div className='flex flex-wrap gap-4 w-full'>
        {dashboadCards.map((card,index)=>(
            <div key={index} className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full">
                <div>
                    
                        <h1 className='text-sm'>{card.title}</h1>
                        <p className='text-xl font-medium mt-1'>{card.value}</p>
                    </div>
                    <card.icon className='w-6 h-6'/>
                
            </div>
        ))}
    </div>
 </div>
<div className="mt-10">
    <p className='text-lg font-medium mb-6'>Active Shows</p>
    <div className='relative'>
        <BlurCircle top='100px' left='-10px'/>
        <div className='grid grid-cols-4 gap-4'>
            {dashboardData.activeShows.map((show) => (
                <div key={show._id} className="h-full flex flex-col rounded-lg overflow-hidden bg-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[3/4] w-full overflow-hidden">
                        <img 
                            src={show.movie.poster_path} 
                            alt={show.movie.title || 'Movie poster'} 
                            className='h-full w-full object-cover hover:scale-105 transition-transform duration-300'
                        />
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                        <p className='font-medium text-base mb-1 line-clamp-2'>{show.movie.title || 'No Title'}</p>
                        <div className='flex items-center justify-between mt-auto'>
                            <p className='text-base font-semibold'>{currency}{show.showPrice}</p>
                            <p className='flex items-center gap-1 text-xs text-gray-400'>
                                <StarIcon className='w-3.5 h-3.5 text-primary fill-primary'/>
                                {show.movie.vote_average?.toFixed(1) || 'N/A'}
                            </p>
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>{dateFormat(show.showDateTime)}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>

        </>
    ):<Loading/>
};
export default Dashboad