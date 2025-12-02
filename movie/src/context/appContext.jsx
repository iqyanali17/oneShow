import { useState, useContext, createContext, useCallback, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const image_base_url =import.meta.env.VITE_TMDB_IMAGE_BASE_URL;


    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = useCallback(async () => {
        try {
            // Wait until Clerk has finished loading the user state
            if (!isLoaded) {
                return false;
            }

            // Check if user is authenticated
            if (!user) {
                console.log('No user found');
                return false;
            }

            setIsLoading(true);

            // Use backend API to verify admin status (keeps frontend & backend in sync)
            const token = await getToken();
            if (!token) {
                console.warn('No auth token found for admin check');
                return false;
            }

            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const isUserAdmin = data?.success && data?.isAdmin;
            setIsAdmin(!!isUserAdmin);

            if (location.pathname.startsWith('/admin') && !isUserAdmin) {
                toast.error('You do not have permission to access this page');
                navigate('/');
            }

            return !!isUserAdmin;

        } catch (error) {
            console.error('Admin check error:', error?.response?.data || error);
            setIsAdmin(false);

            if (location.pathname.startsWith('/admin')) {
                toast.error(error?.response?.data?.message || 'Error verifying admin access');
                navigate('/');
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, isLoaded, getToken, location.pathname, navigate]);

    const fetchShows = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch shows:', error);
        }
    }, []);

    const fetchFavoriteMovies = useCallback(async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setFavoriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    }, [getToken]);

    // Initial data fetch
    useEffect(() => {
        fetchShows();
    }, [fetchShows]);

    // Handle authentication and admin checks
    useEffect(() => {
        if (!isLoaded) return; // Wait for Clerk to finish loading

        let isMounted = true;
        
        const checkAdminAndData = async () => {
            try {
                // On admin routes, verify admin status
                if (location.pathname.startsWith('/admin')) {
                    if (!user) {
                        // Not signed in yet; let the route-level SignIn component handle this
                        return;
                    }

                    await fetchIsAdmin();
                    return;
                }

                // On non-admin routes, load favorites for signed-in users
                if (user) {
                    await fetchFavoriteMovies();
                }

            } catch (error) {
                console.error('Error in admin check flow:', error);
                if (isMounted) {
                    toast.error('An error occurred while checking permissions');
                }
            }
        };

        const timer = setTimeout(() => {
            checkAdminAndData();
        }, 500);
        
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [user, isLoaded, location.pathname, fetchIsAdmin, fetchFavoriteMovies]);

    const value = {
        isAdmin,
        isLoading,
        shows,
        favoriteMovies,
        user,
        getToken,
        navigate,
        fetchIsAdmin,
        fetchFavoriteMovies,
        axios,image_base_url
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};