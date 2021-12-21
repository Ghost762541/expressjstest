const express = require('express');
const mongoose = require('mongoose');
const UserRoute = require('./UserRoutes.js');
const AccountRoute = require('./AccountRoutes');
const app = express();
const config = require('config');

mongoose.connect(config.get('mongo.Mongodb'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.use('/accounts', AccountRoute);
app.use('/users', UserRoute);

app.listen(config.get('admin-api.port'));
//app.listen(5000)