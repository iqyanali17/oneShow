import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/appContext";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { image_base_url } = useAppContext();
    
    // Return loading state if movie is null or has no essential data
    if (!movie || !movie._id) {
        return (
            <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl w-66 h-80 animate-pulse">
                <div className="bg-gray-700 rounded-lg h-52 w-full"></div>
                <div className="mt-2 h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="flex justify-between mt-4 pb-3">
                    <div className="h-8 bg-gray-700 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-700 rounded w-12"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
            <img 
                onClick={() => {
                    if (movie?._id) {
                        navigate(`/movies/${movie._id}`);
                        window.scrollTo(0, 0);
                    }
                }} 
                src={movie?.poster_path ? `${image_base_url}${movie.poster_path}` : movie?.backdrop_path ? `${image_base_url}${movie.backdrop_path}` : '/placeholder-movie.jpg'}
                alt={movie?.title || 'Movie poster'} 
                className="rounded-lg h-52 w-full object-cover cursor-pointer"
            />
            
            <p className="font-semibold mt-2 truncate">{movie?.title || 'Movie Title'}</p>

            <p className="text-sm text-gray-400 mt-2">
                {movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} ● 
                {movie?.genres?.slice(0, 2).map(genre => genre?.name).filter(Boolean).join(" | ") || 'Genre'} ● 
                {movie?.runtime ? timeFormat(movie.runtime) : 'N/A'}
            </p>

            <div className="flex items-center justify-between mt-4 pb-3">
                <button 
                    onClick={() => {
                        if (movie?._id) {
                            navigate(`/movies/${movie._id}`);
                            window.scrollTo(0, 0);
                        }
                    }} 
                    className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
                >
                    Buy Ticket
                </button>

                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                    {movie?.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
            </div>
        </div>
    )
}

export default MovieCard