const mongoose = require('mongoose');


async function connectTodb() {
   await mongoose.connect("mongodb+srv://sudhir:sam771590@cluster0.afalbnq.mongodb.net/")
}




module.exports = connectTodb;