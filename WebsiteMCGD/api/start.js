require('./models/LogLine');
const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
var http = require('http');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection
    .on('open', () => {
        console.log('Mongoose open');
    })
    .on('error', (err) => {
        console.log(`Error: ${err.message}`);
    });

http.createServer(app).listen(3075, () => {
    console.log("HTTP Express is running on port 3075");
});