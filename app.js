const express =  require('express')
const app = express();
const {auth} = require('./middleware/auth');
const port  = 7777;
const connectTodb = require("./config/database")


const {userAuth} = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const Authroutes =  require('./routes/registreationLoginRoutes')
const profileRoutes = require('./routes/profileRouters')
const requestsRoute = require("./routes/request")
const UserRoutes = require("./routes/user")
const cors = require("cors")

app.use(cors({
  origin: "http://localhost:5173",   // whitelisted
  credentials: true, // allow session cookies
  //secure: false, // set to true if using HTTPS
}))

app.use(express.json()) //read the json object convert into js // this is middleware we have use so this can use for all routes but when we use
                        //app.use(/test ()=>{}) // this use as routes.
app.use(cookieParser());

app.use('/',Authroutes);
app.use('/',profileRoutes);
app.use('/',requestsRoute)
app.use('/', UserRoutes)





connectTodb()
 .then(()=>{
  console.log("database connected")
  app.listen(port,()=>{
    console.log("our Tinder is running on port 7777",{port})
  }
  )

 })
  .catch((err)=>{
    console.log("err while connectind db",err)
  })



//find all
app.get('/users',async(req,res)=>{
    try{
      let users = await  USER.find({})
      res.send(users)
    }
    catch(err){
      res.send("error while fetching all users")

    }

})


//find by Email
app.get('/userEmail',async(req,res)=>{
   let emailIds = req.body.emailId;
  try{
    let user =  await USER.findOne({emailId: emailIds })
    res.status(200).send(user)
  }catch(e){
      res.send("error while fetching user by email",e)
    
  }



})



//find by id
app.get('/userId',async(req,res)=>{
let id =  req.body.id;
try{
  let user =  await USER.findById({_id:id})
  res.send(user)

}catch(e){
  res.send("error while fetching user by id")
}

})



//delete 
app.delete('/deleteByid',async(req,res)=>{
let id = req.body.id;
try{
  let deletuser = await USER.deleteOne({_id:id})
  res.send("user deleted successfully")
}catch(e){
 res.send("error while deleting data")
 
}

})


// //update by pathch findbyidpatch  correct this 
// app.patch('/updateUser/:userId',async(req,res)=>{
//   let id =  req.params.userId;


//   try{
//     let allowedField = ["userId","firstname", "lastname","skills", "age","gender"]
//     // let updateFields = Object.keys(req.body).every((keys)=>allowedField.includes(keys));
//     // if(!updateFields){
//     //   throw new Error("cananot be update")
//     // }
//     let update =  await USER.findByIdAndUpdate(id,{:id})
//     res.send("data updatedb succesfully")
    
//   }catch(e){
//     res.send("error while updating data" + e)

//   }
// })


//update by firstname
app.put('/updateUser',async(req,res)=>{
  let id =  req.body.id;
  let fname =  req.body.firstname

  try{
    if(!fname){
      throw new Error("firstname is required")
    }

    let allowedField = ["firstname", "lastname","skills", "age","gender"]
    let updateFields = Object.keys(req.body).every((keys)=>allowedField.includes(keys));
    if(!updateFields){
      throw new Error("cananot be update")
    }
    let update =  await USER.findByIdAndUpdate(id,{firstname:fname})
    res.send("data updatedb succesfully")
    
  }catch(e){
    res.send("error while updating data" + e)

  }
})

//update by emailid

