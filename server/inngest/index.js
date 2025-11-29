import { User } from "@clerk/express";
import { Inngest } from "inngest";



// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a databse
const syncCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async (event) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url

        }
        await User.creat(userData)


    }

)
// Ingest Function to delete user from datbase

const synUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDele(id)
    }
)

// Inngest Funtion to update user data in databse

const synUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.update' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url

        }

        await User.findByIdAndUpdate(id, userData)
    }
)





// Create an empty array where we'll export future Inngest functions
export const functions =
    [syncCreation,
        synUserDeletion, 
        synUserUpdation
    ];