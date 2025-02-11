const validator =  require('validator')

function validation(req){
const email =  req;

if(!validator.isEmail(email)){
     throw new Error("Email is not valid")
}

}

const validatedEditProfileData = (req)=>{
const allowedField = ['firstname', 'lastName', 'photoUrl', 'skills', 'gender', 'age'];

const isvalid= Object.keys(req.body).every(field =>allowedField.includes(field))

return  isvalid;

}

module.exports ={validation,validatedEditProfileData}