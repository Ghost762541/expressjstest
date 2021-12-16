const express = require('express')
const loginRoute = express.Router();
const mongoose = require('mongoose');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const { User } = require('../model');
const md5 = require('md5');
//const { User, Account } = require('../model.js');

const oneDay = 1000 * 60 * 60 * 24;

loginRoute.use(cookieParser());
let session;

loginRoute.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

loginRoute.use(function timeLog(req, res, next) {
  next();
});

loginRoute.get('/', (req, res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.render('login')
});

loginRoute.post('/', async (req, res) => {
    //const user = await User.findOne({ email: req.body.email });
    let user = await User.findOne({ mail: req.body.email }).exec();
    console.log(user)
    //if(req.body.email == user.email && req.body.password == user.password){
    console.log(req.body.password)
    console.log(md5(req.body.password))
    if(req.body.email == user.mail && md5(req.body.password) == user.passwordHash){
        session=req.session;
        session.userid=req.body.email;
        console.log(req.session)
        res.redirect('/login/user/' + req.body.email + "")
    }
    else{
        res.send('Invalid username or password');
    }
});

loginRoute.get('/user/:id', (req, res) => {
    res.render('user')
})

loginRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/login")
})

module.exports = loginRoute;