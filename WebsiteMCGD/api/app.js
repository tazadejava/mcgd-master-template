const express = require('express');
const cors = require('cors')
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//limit 256kb, should be more than enough for all code
app.use(fileUpload({
    limits: { 
        fileSize: 1024 * 256
    }
}));

app.use('/', routes);

module.exports = app;