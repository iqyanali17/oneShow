import { clerkClient, getAuth } from '@clerk/express';

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const user = await clerkClient.users.getUser(userId);
        
        // Check if user has admin role in private metadata
        if (user.privateMetadata?.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "You don't have permission to access this resource" 
            });
        } 
        
        // Attach user to request for use in controllers
        req.user = user;
        next();

    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(401).json({ 
            success: false, 
            message: "Authentication failed" 
        });
    }
}
