const express = require('express');
const Authroutes = express.Router();
const validation = require('../validators/validation')
const bcrypt = require('bcrypt');
const USER = require('../models/schema')

Authroutes.post('/signin', async (req, res) => {

    try {
        const password = req.body.password;
        const email = req.body.emailId;
        //VALIDATION
        validation.validation(email)

        let bcrprtedPass = await bcrypt.hash(password, 10);

        const user = new USER({
            firstname: req.body.firstname,
            lastName: req.body.lastName,
            password: bcrprtedPass,
            emailId: email
        }
        )
        let savedUser = await user.save()
        let token = await savedUser.getjwtToken()
        res.cookie("token", token,{
            expires: new Date(Date.now() + 60 * 60 * 1000) } // expires in 1 hour  // will set token for all.
        )   // will set token for all.

        res.json({message:"User Sinup Successfully", data : savedUser})
    } catch (err) {
        res.send("error while register data" + err)
    }
})

//login


Authroutes.post('/login', async (req, res) => {
    try {
        let email = req.body.emailId;
        let pass = req.body.password
        let user = await USER.findOne({ emailId: email })
        if (!user) {
            throw new Error("invalid credientials")
        }
        let passtrue = await user.validatePassword(pass)
        if (passtrue) {
            // create a jwt tokenn
            let token = await user.getjwtToken()

            res.cookie("token", token)   // will set token for all.
            res.send(user).pop
        } else {
            res.status(401).send("Invalid crediential")
        }
    } catch (e) {
        res.status(401).send("error: " + e.message)
    }
})


Authroutes.post('/logout',async(req, res) => {
 res.cookie("token",null,{
    expires: new Date(0) // expires immediately
  }); 
  res.send('logout successfuly  :)  ')
 }) //







module.exports = Authroutes