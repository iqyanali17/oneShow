import User from "../models/User.js";
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database
const syncCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async (event) => {
        try {
            console.log('Received user creation event:', JSON.stringify(event, null, 2));
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`.trim(),
                image: image_url,
                createdAt: new Date()
            };
            
            console.log('Creating user with data:', userData);
            const user = await User.create(userData);
            console.log('User created successfully:', user);
            
            // Verify the user was saved
            const foundUser = await User.findById(id);
            console.log('User found in database:', foundUser);
            
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // This will make the function retry
        }
    }
)

// Ingest Function to delete user from database

const synUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        try {
            console.log('Received user deletion event:', JSON.stringify(event, null, 2));
            const { id } = event.data;
            console.log('Deleting user with ID:', id);
            const result = await User.findByIdAndDelete(id);
            console.log('User deletion result:', result);
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
)

// Inngest Function to update user data in database

const synUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.update' },
    async ({ event }) => {
        try {
            console.log('Received user update event:', JSON.stringify(event, null, 2));
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                email: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`.trim(),
                image: image_url,
                updatedAt: new Date()
            };
            
            console.log('Updating user with data:', userData);
            const result = await User.findByIdAndUpdate(
                id, 
                { $set: userData },
                { new: true, upsert: false }
            );
            
            console.log('User update result:', result);
            return { success: true, userId: id };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
)

// Export all functions as an array
export const functions = [
    syncCreation,
    synUserDeletion,
    synUserUpdation
];