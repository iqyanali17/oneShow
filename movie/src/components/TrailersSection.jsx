import React, { useState, useEffect } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
    const [trailers, setTrailers] = useState([]);
    const [currentTrailer, setCurrentTrailer] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [activeTrailer, setActiveTrailer] = useState(null);

    useEffect(() => {
        if (dummyTrailers && dummyTrailers.length > 0) {
            const processedTrailers = dummyTrailers.map((trailer, index) => {
                // Extract video ID from YouTube URL
                let videoId = '';
                try {
                    const url = new URL(trailer.videoUrl);
                    videoId = url.searchParams.get('v') || '';
                    console.log(`Processing trailer ${index}:`, { videoUrl: trailer.videoUrl, extractedId: videoId });
                } catch (e) {
                    console.error('Invalid video URL:', trailer.videoUrl);
                }
                
                // Always use the YouTube-generated thumbnail URL to ensure it works
                const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
                
                return {
                    ...trailer,
                    id: trailer.id || `trailer-${index}`,
                    image: thumbnailUrl, // Always use the generated URL
                    videoId: videoId,
                    youtubeUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
                };
            }).filter(trailer => trailer.videoId);
            
            console.log('Processed trailers:', processedTrailers);
            
            if (processedTrailers.length > 0) {
                setTrailers(processedTrailers);
                setCurrentTrailer(processedTrailers[0]);
                setActiveTrailer(processedTrailers[0]);
                setIsMounted(true);
            } else {
                console.error('No valid trailers found');
                setIsMounted(true);
            }
        } else {
            console.error('No dummyTrailers data available');
            setIsMounted(true);
        }
    }, []);

    const handleThumbnailClick = (trailer) => {
        setCurrentTrailer(trailer);
        setActiveTrailer(trailer);
        setPlaying(false); // Show thumbnail first
        setPlayerKey(prev => prev + 1); // Force re-render
    };

    const handlePlayClick = () => {
        setPlaying(true);
        setHasInteracted(true);
    };

    if (!isMounted) {
        return (
            <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
                <p className="text-gray-300 font-medium text-lg max-w-[960px]">Loading trailers...</p>
            </div>
        );
    }

    if (!currentTrailer || !trailers.length) {
        return (
            <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
                <p className="text-gray-300 font-medium text-lg max-w-[960px]">No trailers available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg max-w-[960px] mb-6">Trailers</p>
            
            {/* Main Trailer Player */}
            <div className="relative mt-6 rounded-xl overflow-hidden bg-black/20">
                <BlurCircle top="-100px" right="-100px" />
                <div className="aspect-video max-w-5xl mx-auto bg-black">
                    {currentTrailer?.youtubeUrl ? (
                        <div className="w-full h-full relative">
                            {!playing ? (
                                <div 
                                    className="w-full h-full bg-cover bg-center relative"
                                    style={{
                                        backgroundImage: `url(${currentTrailer.image || `https://img.youtube.com/vi/${currentTrailer.videoId}/maxresdefault.jpg`})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                        onClick={handlePlayClick}
                                    >
                                        <div className="w-24 h-24 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-all transform hover:scale-110">
                                            <PlayCircleIcon className="w-16 h-16 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ReactPlayer 
                                    key={playerKey}
                                    url={currentTrailer.youtubeUrl}
                                    width="100%"
                                    height="100%"
                                    playing={true}
                                    controls={true}
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                    onError={(e) => {
                                        console.error('Error playing video:', e);
                                        setPlaying(false);
                                    }}
                                    config={{
                                        youtube: {
                                            playerVars: { 
                                                autoplay: 1,
                                                showinfo: 0,
                                                controls: 1,
                                                modestbranding: 1,
                                                rel: 0,
                                                origin: window.location.origin,
                                                enablejsapi: 1
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <p className="text-gray-400">No video available. Invalid YouTube URL.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-8 max-w-5xl mx-auto">
                {trailers.slice(0, 4).map((trailer) => (
                    <div 
                        key={trailer.id}
                        className={`relative group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                            currentTrailer?.id === trailer.id 
                                ? 'ring-2 ring-primary transform scale-105' 
                                : 'hover:scale-105 hover:ring-2 hover:ring-white/30'
                        }`}
                        onClick={() => handleThumbnailClick(trailer)}
                    >
                        <div className="w-full aspect-video bg-gray-800 relative overflow-hidden rounded-lg">
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900">
                                <img 
                                    src={trailer.image || `https://img.youtube.com/vi/${trailer.videoId}/hqdefault.jpg`} 
                                    alt={trailer.title || 'Trailer thumbnail'} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    style={{
                                        minWidth: '100%',
                                        minHeight: '100%',
                                        objectFit: 'cover',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onError={(e) => {
                                        const img = e.target;
                                        console.log('Error loading thumbnail:', img.src);
                                        img.onerror = null;
                                        
                                        const formats = [
                                            `https://img.youtube.com/vi/${trailer.videoId}/maxresdefault.jpg`,
                                            `https://img.youtube.com/vi/${trailer.videoId}/hqdefault.jpg`,
                                            `https://img.youtube.com/vi/${trailer.videoId}/mqdefault.jpg`,
                                            `https://img.youtube.com/vi/${trailer.videoId}/default.jpg`
                                        ];
                                        
                                        let currentFormat = 0;
                                        const tryNextFormat = () => {
                                            if (currentFormat < formats.length) {
                                                console.log('Trying thumbnail format:', formats[currentFormat]);
                                                img.src = formats[currentFormat];
                                                currentFormat++;
                                            } else {
                                                console.log('All thumbnail formats failed');
                                                img.src = 'https://via.placeholder.com/300x169?text=No+Thumbnail';
                                                img.className = 'w-full h-full object-contain p-2';
                                            }
                                        };
                                        
                                        img.onerror = tryNextFormat;
                                        tryNextFormat();
                                    }}
                                    loading="lazy"
                                    onLoad={(e) => {
                                        console.log('Thumbnail loaded successfully:', e.target.src);
                                        e.target.style.opacity = '1';
                                    }}
                                />
                            </div>
                            {/* Debug overlay - shows video ID on hover */}
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs font-medium truncate">{trailer.title || 'Movie Trailer'}</p>
                                <p className="text-gray-300 text-[10px]">{trailer.videoId || 'No video ID'}</p>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                                <PlayCircleIcon 
                                    strokeWidth={1.5} 
                                    className="w-8 h-8 text-white"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrailersSection;