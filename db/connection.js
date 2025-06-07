const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://srvignesh:MyMongodb$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Successfully connected to the database. You are all set to go!!! '))
    .catch(err => console.error('Something went wrong', err));