require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@pruebastecnicas.sm4lf1d.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true})
.then((db) => console.log(`Mongo DB has been conected in: ${db.connection.name}`))
.catch(err=>console.log(`This error has been interupt: \n${err}`));