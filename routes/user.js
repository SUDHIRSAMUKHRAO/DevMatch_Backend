const express = require('express');
const UserRoute = express.Router();
const USER = require('../models/schema');
const { userAuth } = require('../middleware/auth');
const connectionRequest = require('../models/connections');

const UserSafeData = 'firstname lastname gender age photoUrl skills'
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


UserRoute.get('/user/connection',userAuth, async (req, res)=>{
try{

    const loggedInUser =  req.user;
    const connections  =  await connectionRequest.find({
        $or:[
            {fromUserId: loggedInUser._id,status: 'accepted'},
            {toUserId: loggedInUser._id,status: 'accepted'}
        ]
    }).populate(
        'fromUserId toUserId',
        UserSafeData );
    const dataconnections = connections.map((row)=>row.fromUserId); // it was sending whole object now only will send fromUserId obejects
  res.json({
        message: 'Data Fetched successfully',
        data: dataconnections
    });
}catch(err){
   
    res.status(500).send('Server Error',err);
}



})


module.exports = UserRoute