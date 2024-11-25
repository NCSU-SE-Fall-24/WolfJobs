const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(`mongodb+srv://kpatel47:${process.env.MONGO_PASS}@wolfjobs.0qqf1.mongodb.net/wolf`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongodb'));

db.once('open',function(){
    console.log('Connected to database :: MongoDB')
})

module.exports = db;