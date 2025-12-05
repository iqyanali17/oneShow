import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/appContext";

const FeaturedSection = () => {
    const navigate = useNavigate()
    const { shows } = useAppContext()

    return (
        <div className="px-6 md:px-16 xl:px-44 overflow-hidden">
            <div className="relative flex items-center justify-between pt-20 pb-10">
                <BlurCircle top='0' right='-80px' />
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <button onClick={() => navigate('/movies')} className="text-sm text-gray-300 cursor-pointer">View All</button>
            </div>
            <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
                {shows && shows.length > 0 ? (
                    shows.slice(0, 5).map((show) =>
                        show && show._id ? (
                            <MovieCard key={show._id} movie={show} />
                        ) : null
                    )
                ) : (
                    <p className="text-gray-400">No shows available at the moment.</p>
                )}
            </div>
            <div className="flex justify-center mt-20">
                <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transion rounded-md font-medium cursor-pointer">Show More</button>

            </div>
        </div>
    )
}
export default FeaturedSection