
const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_URI; // Use the correct env variable

mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    });