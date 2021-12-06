const express = require('express')
const UserRoute = express.Router();
const mongoose = require('mongoose')

const Userschema = new mongoose.Schema({titleUser: 'string', accountId: 'string', userId: 'string' });
const User = mongoose.model('User', Userschema);

UserRoute.use(function timeLog(req, res, next) {
    next();
  });

UserRoute.get('/', async (req, res) => {
    const users = await User.find()
    console.log(users)
    res.render('users', {
        users,
   })
  });

UserRoute.get('/new', (req, res) => {
    res.render('newUser')
  });

UserRoute.post('/new', (req, res) => {
    User.count({}, function( err, count){
        console.log( count );
    })
    let c = User.count({});
    console.log('count', c);
    const newuser = new User({titleUser: req.body.titleUser, accountId: req.body.Id, userId: c});
    newuser.save();
    res.redirect('/users');
  })

UserRoute.get('/delete/:_id', async (req, res) => {
    User.find({_id: req.params._id}).remove().exec();
    res.redirect('/users');
})

module.exports = UserRoute;