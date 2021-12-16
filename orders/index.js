const express = require('express');
const mongoose = require('mongoose');
const loginRoute = require('../routes/loginRout');
const app = express();

mongoose.connect('mongodb://192.168.241.84:27017/test');
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.use('/login', loginRoute);

app.listen(5000);