const mongoose = require('mongoose');


async function connectTodb() {
   await mongoose.connect("mongodb://localhost:27017/DevTinder")
}




module.exports = connectTodb;