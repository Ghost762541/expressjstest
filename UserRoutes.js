const express = require('express')
const UserRoute = express.Router();
const mongoose = require('mongoose')
const { User, Account } = require('./model.js');


UserRoute.use(function timeLog(req, res, next) {
    next();
  });

UserRoute.get('/', async (req, res) => {
    const users = await User.find()
    console.log(users)
    res.render('users/users', {
        users,
   })
  });

UserRoute.get('/new', (req, res) => {
    res.render('users/new')
  });

UserRoute.post('/new', async (req, res) => {
    let c = await User.count({}) + 1;
    // console.log('count', c);
    const newuser = new User({titleUser: req.body.titleUser, accountId: req.body.Id, userId: c});
    await newuser.save();
    res.redirect('/users');
  })

UserRoute.get('/delete/:_id', async (req, res) => {
    User.find({_id: req.params._id}).remove().exec();
    res.redirect('/users');
})

module.exports = UserRoute;
