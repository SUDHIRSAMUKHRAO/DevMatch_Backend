const express = require('express');
const UserRoute = express.Router();
const USER = require('../models/schema');
const { userAuth } = require('../middleware/auth');
const connectionRequest = require('../models/connections');
const User =  require('../models/schema');

const UserSafeData = 'firstname lastName gender age photoUrl skills about'

//get all requests of logged in user
UserRoute.get('/user/request/recieved', userAuth, async (req, res) => {
    try{
    const loggedInUser =  req.user;
    const connectionRequests  =  await connectionRequest.find({
        toUserId: loggedInUser._id,
        status: 'intrested'



    }).populate(
        'fromUserId',
        'firstname lastname gender age photoUrl skills');

    res.json({
        message: 'Data Fetched successfully',
        data: connectionRequests
    });
    } 
    catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }


});

//connections of user
UserRoute.get('/user/connection', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Find all accepted connections where logged-in user is involved
        const connections = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        })
        .populate({
            path: 'fromUserId',
            UserSafeData
        })
        .populate({
            path: 'toUserId',
            UserSafeData
        });

        console.log("Fetched Connections:", connections);

        // Ensure both users see full details of their connections
        const dataconnections = connections.map(row => {
            if (row.fromUserId && row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;  // Return full user details, not just ID
            } else {
                return row.fromUserId;
            }
        });

        console.log("Final Connections Data:", dataconnections);

        res.json({
            message: 'Data Fetched successfully',
            data: dataconnections
        });
    } catch (err) {
        console.error("Error fetching connections:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});






// Feed of user
UserRoute.get('/feed', userAuth, async (req, res) => {
    try {
        // Logic
        // Profile should not be shown to the user himself.
        // Requests that are sent, ignored, or accepted should also be hidden.
    // paination logic use skip and limit.
        const loggedInUser = req.user;
        const page = (req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit =  limit>50 ? 50 :limit; 
        const skip = (page - 1) * limit;

        // This will fetch connection requests where the logged-in user is either sender or receiver.
        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }]
        }).select("fromUserId toUserId");

        // Create a set to store unique user IDs that should be hidden from the feed.
        const hiddenFromFeed = new Set();

        connectionRequests.forEach((connection) => {
            hiddenFromFeed.add(connection.fromUserId._id); // Add sender ID to set
            hiddenFromFeed.add(connection.toUserId._id);   // Add receiver ID to set
        });

        // Fetch users excluding:
        // 1. Logged-in user themselves
        // 2. Users who have a connection request with the logged-in user (sent, ignored, or accepted)
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenFromFeed) } }, // Convert set to array and filter out
                { _id: { $ne: loggedInUser._id } } // Exclude logged-in user
            ]
        }).select(UserSafeData).skip(skip).limit(limit)// Selecting only necessary fields
 

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(400).json({ success: false, message: "Internal Server Error" ,error: error });
    }
});







module.exports = UserRoute