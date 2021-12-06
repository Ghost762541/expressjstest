const express = require('express')
const mongoose = require('mongoose')
const UserRoute = require('./UserRoutes.js')
const AccountRoute = require('./AccountRoutes')
const app = express()

mongoose.connect('mongodb://192.168.241.84:27017/test');
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.use('/accounts', AccountRoute);
app.use('/users', UserRoute);

app.listen(3000)