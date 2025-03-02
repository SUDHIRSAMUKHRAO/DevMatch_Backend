const express = require('express');
const profileRoutes = express.Router();
const validation = require('../validators/validation')
const bcrypt = require('bcrypt');
const USER = require('../models/schema')
const {userAuth} = require('../middleware/auth');
const {validatedEditProfileData} = require('../validators/validation')





//profile

profileRoutes.get('/profile/view',userAuth,async(req,res)=>{

    try {
  
      let user =  req.user
     
      res.send(user)
      
    
    } catch (error) {
      res.status(500).send(error.message)
    }
  
  
  }
)


profileRoutes.patch('/profile/edit',userAuth,async(req,res)=>{
 try{
    if(!validatedEditProfileData(req)){
        throw new Error("Invalid Edit Request")
    
    }

    const user =  req.user   /// coming from userAuth
    Object.keys(req.body).forEach((key) => (user[key]= req.body[key]));
    await user.save()
    res.json({
      message: `${user.firstname},"your profile updated successfully"`,
      data: user
    })
 }catch(error){
    res.status(500).send(error.message)
 }


})



profileRoutes.patch('/profile/password', userAuth,async (req, res) => {

    //forgot password
    //login asla pahije
    
    try {
        let pass = req.body.password; 
        let user =  req.user;
        let bcrprtednewPass = await bcrypt.hash(pass, 10);
        let update =  await USER.findByIdAndUpdate(user.id,{password:bcrprtednewPass})
        res.status(200).send("password change successfully")
    } catch (e) {
        res.send("login unsucessfull" + e)
    }
})


module.exports = profileRoutes