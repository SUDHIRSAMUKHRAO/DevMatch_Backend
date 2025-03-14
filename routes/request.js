const express = require('express');
const requestsRoute = express.Router();
const USER = require('../models/schema');
const { userAuth } = require('../middleware/auth');
const connectionRequest = require('../models/connections');

// Send Connection Request
requestsRoute.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        let status = req.params.status;
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;

        const allowedStatus = ["intrested", "ignored"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid Request Status");
        }

        const toUser = await USER.findById(toUserId);
        if (!toUser) {
            throw new Error("User not found");
        }

        const existingRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).send("Connection request already sent");
        }

        const newConnectionRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await newConnectionRequest.save();

        res.json({
            message: "Request sent successfully",
            data
        });

    } catch (err) {
        res.status(400).send(err.message);
    }
});


requestsRoute.post('/request/review/:status/:userid',userAuth,async(req, res)=>{
   try{ 
   const status = req.params.status;
  const reqestId =  req.params.userid;
   const loggedInUser = req.user;
    
     const allowedStatus = ["accepted", "Rejected"];
     if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"invalid status"});
     }

   const connectionRequestSchema =  await connectionRequest.findOne({
     _id: reqestId,
     toUserId :loggedInUser._id,
     status : "intrested"
   })

   if(!connectionRequestSchema){
      return res.status(404).json({message:"connection  Request not found"});
   }
   connectionRequestSchema.status = status;
   const data =  await connectionRequestSchema.save();
   res.json({message: "connection request " +status , data});

   }catch(err) {
      res.status(400).json({message:err.message});
   }





});

module.exports = requestsRoute;
