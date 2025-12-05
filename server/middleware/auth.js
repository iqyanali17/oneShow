import { clerkClient, getAuth } from '@clerk/express';

export const protectAdmin = async (req, res, next) => {
    try {
        let userId;
        
        // Try to get userId from Clerk session first
        const auth = getAuth(req);
        userId = auth?.userId;
        
        // If no session, try to get from Authorization header (Bearer token)
        if (!userId && req.headers.authorization) {
            const token = req.headers.authorization.replace('Bearer ', '');
            try {
                // Verify the JWT token and extract userId
                const verifiedToken = await clerkClient.verifyToken(token);
                userId = verifiedToken.sub;
            } catch (tokenError) {
                console.warn('Token verification failed:', tokenError.message);
            }
        }
        
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
