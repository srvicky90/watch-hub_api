const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://srvignesh:MyMongo$09@cluster0.ofqeznu.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));