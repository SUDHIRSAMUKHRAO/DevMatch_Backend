const jwt = require('jsonwebtoken');
const User = require('../models/schema');






const userAuth = async(req,res,next) => {
//read the token from the req
// validate the token
// if the token is valid then see user is exist in the database.
try{

    const {token } = req.cookies;
    if(!token){
           return res.status(401).send("Please Login!");
    }

const decodedtoken = await jwt.verify(token, 'sam@771590')

const {id}= decodedtoken;

const user = await User.findById(id);
if(!user){ 
    throw new Error("user not found");
}
req.user = user;

    next()



}catch(e){
   res.status(400).send("error: " + e.message)

}}





module.exports = {
    userAuth
}