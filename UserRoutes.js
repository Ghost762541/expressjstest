const express = require('express')
const UserRoute = express.Router();
const mongoose = require('mongoose')
const moment = require('moment');
//const Chart = requaire('chart.js/auto');
//const jquery = require('jquery');
//const DatDataTable = require('DataTable.net')

const { User, Account } = require('./model.js');

UserRoute.use(function timeLog(req, res, next) {
    next();
  });

UserRoute.get('/', async (req, res) => {
    const users = await User.find();
    //console.log(users);
    res.render('users/users');
});

UserRoute.get('/a', async (req, res) => {
  const users = await User.find();
  //console.log(users);
  res.json({data: users});
});

UserRoute.get('/chart', async (req, res) => {
    let data_chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let current_date = '2021-12-09';
    let current_date_time = '2021-12-09 01:59:45';
    let users = await User.find( { date_created : { $regex : current_date } } )
    for (let i=0; i < users.length; i++) {
      data_chart[Number(users[i].date_created.slice(11, 13))] ++;
    }
    res.json(data_chart);
  });

UserRoute.get('/new', (req, res) => {
    res.render('users/new')
});

UserRoute.post('/new', async (req, res) => {
    let c = await User.count({}) + 1;
    let date_created = moment();
    //console.log('date ', date_created);
    const newuser = new User({titleUser: req.body.titleUser, accountId: req.body.Id, userId: c, date_created: date_created.format('YYYY-MM-DD HH:mm:ss')});
    await newuser.save();
    res.redirect('/users');
})

UserRoute.get('/delete/:_id', async (req, res) => {
    User.find({_id: req.params._id}).remove().exec();
    res.redirect('/users');
})

module.exports = UserRoute;
