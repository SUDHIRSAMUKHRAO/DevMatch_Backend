const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userScehma = new mongoose.Schema({
   firstname: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      index: true
   },
   lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
      required: true, 
      //match: /^[A-Z][a-z]+$/, // starts with uppercase letter and contains only lowercase letters

   },
   emailId: {
      type: String,
      required: true,
      unique: true,
      trime : true,
      validate(value){
         if(!validator.isEmail(value)){
            throw new Error("Invalid email")
         }
      }
   },
   password: {
      type: String,
      required: true,

   },
   gender: {
      type: String,
      validate(value) {
         if (value != "Male" && value != "Female") {
            throw new Error("gender should be Male or Female")
         }
      }
   },
   age: {
      type: Number,
      min: 18,
      max: 99
   },
   photoUrl:{
      type: String,
      default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y"
   },
   skills: {
      type: [String],
   }
   
}, 
 {
   timestamps
      : true
}

)


userScehma.methods.getjwtToken =  function () {
   let user =  this;
   const token = jwt.sign({id: this._id}, 'sam@771590', {expiresIn: '1h'})
   return token;
   
 
 }

userScehma.methods.validatePassword = function (passwordinputbyuser){
   const passwordhash = this.password;
  const ispassvalid =  bcrypt.compare(passwordinputbyuser,passwordhash);
  return ispassvalid;
}

module.exports = mongoose.model("USER", userScehma)