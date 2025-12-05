import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// Helper function for TMDB API calls with retry logic
const tmdbApiCall = async (url, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.get(url, {
                params: { api_key: process.env.TMDB_API_KEY },
                timeout: 10000, // 10 second timeout
                headers: {
                    'User-Agent': 'OneShow-Server/1.0'
                }
            });
            return response;
        } catch (error) {
            console.error(`TMDB API attempt ${attempt} failed:`, error.code || error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
            console.log(`Retrying TMDB API call in ${delay}ms...`);
        }
    }
};

// API to get now playing movies from TMDB API

export const getNowPlayingMovies = async (req, res) => {
    try {
        // Try TMDB API first with retry logic
        const { data } = await tmdbApiCall('https://api.themoviedb.org/3/movie/now_playing');
        const movies = data.results;
        console.log(`Successfully fetched ${movies.length} movies from TMDB`);
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error('TMDB API Error after retries:', error.code || error.message)
        
        // Fallback to mock data if TMDB fails
        console.log('Using mock data as fallback');
        const mockMovies = [
            {
                id: 1,
                title: "Sample Movie 1",
                poster_path: "/placeholder1.jpg",
                vote_average: 7.5,
                vote_count: 1000,
                release_date: "2024-01-01"
            },
            {
                id: 2,
                title: "Sample Movie 2", 
                poster_path: "/placeholder2.jpg",
                vote_average: 8.0,
                vote_count: 1500,
                release_date: "2024-01-15"
            }
        ];
        res.json({ success: true, movies: mockMovies })
    }
}
// API to add a new show to the databases
export const addShow = async (req, res) => {

    try {
        const { movieId, showsInput, showPrice } = req.body;
        
        // First try to find by TMDB ID (from TMDB API)
        let movie = await Movie.findOne({ tmdbId: movieId });
        
        // If not found, fetch from TMDB API and create new movie
        if (!movie) {
            // fetch the movie details and credit from TMDB API

            console.log('Fetching movie details from TMDB API...');
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                tmdbApiCall(`https://api.themoviedb.org/3/movie/${movieId}`),
                tmdbApiCall(`https://api.themoviedb.org/3/movie/${movieId}/credits`)
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            
            console.log('TMDB API Response:', {
                title: movieApiData.title,
                backdrop_path: movieApiData.backdrop_path,
                poster_path: movieApiData.poster_path,
                hasGenres: !!movieApiData.genres,
                hasCasts: !!(movieCreditsData && movieCreditsData.cast)
            });
                  const movieDetails={
                    tmdbId: movieId,
                    title: movieApiData.title,
                    overview: movieApiData.overview || "No overview available",
                    poster_path: movieApiData.poster_path || "",
                    backdrop_path: movieApiData.backdrop_path || "",
                    genres: movieApiData.genres ? movieApiData.genres.map(g => g.name) : [],
                    casts: movieCreditsData.cast || [],
                    release_date: movieApiData.release_date || new Date().toISOString().split('T')[0],
                    original_language: movieApiData.original_language || "en",
                    tagline: movieApiData.tagline || "",
                    vote_average: movieApiData.vote_average || 0,
                    runtime: movieApiData.runtime || 0,
                  }
                //   Add movie to the databses
                movie=await Movie.create(movieDetails);
                }
                const showsToCreate = [];
                
                // Ensure showsInput is an array
                if (!Array.isArray(showsInput)) {
                    throw new Error('showsInput must be an array');
                }

                showsInput.forEach(show => {
                    const showDate = show.date;
                    // Ensure show.time is an array
                    const times = Array.isArray(show.time) ? show.time : [show.time];
                    
                    times.forEach(time => {
                        const dateTimeString = `${showDate}T${time}`;
                        showsToCreate.push({
                            // Store the actual Movie ObjectId reference, not the TMDB id
                            movie: movie._id,
                            showDateTime: new Date(dateTimeString),
                            showPrice,
                            occupiedSeats: {}
                        });
                    });
                });
if(showsToCreate.length>0){
    await Show.insertMany(showsToCreate);
}
res.json({success:true,message:'Show Added successfully.'})

    } catch (error) {
        console.error('Error in addShow:', error.code || error.message);
        
        // Handle specific TMDB API errors
        if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
            console.log('TMDB API connection issue - please try again later');
            return res.json({ 
                success: false, 
                message: 'Unable to connect to movie database. Please try again later.' 
            });
        }
        
        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        res.json({ success: false, message: errorMessage })
    }
}

// API to get all shows from the datbase
export const getShows = async (req, res) => {
    try {
        // First find and sort the shows, then populate the movie data
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
        .populate('movie').sort({ showDateTime: 1 })
            
            

        // Filter unique e shows
        const uniqueShows = new Set (shows.map(show=>show.movie))
        res.json({success:true,shows :Array.from(uniqueShows)})
        
        
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});

    }
}

// API to get a single show form the database
export const getShow= async (req,res)=>{
    try{
        const {movieId}=req.params;
        // get all upcoming shows for the movie
        const shows=await Show.find({movie:movieId,showDateTime:{$gte:new Date()}})

        const movie=await Movie.findById(movieId);
        const dateTime ={};

        shows.forEach((show)=>{
            const date=show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date]=[]
            }
            dateTime[date].push({time:show.showDateTime,showId:show._id,showPrice:show.showPrice})
        })
        res.json({success:true,movie,dateTime,showPrice:shows.length > 0 ? shows[0].showPrice : 0})

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

