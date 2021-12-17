const express = require('express')
const loginRoute = express.Router();
const mongoose = require('mongoose');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const { User, Order } = require('../model');
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
        let id = user.userId
        res.redirect('/login/user/' + id + "")
    }
    else{
        res.send('Invalid username or password');
    }
});

loginRoute.get('/user/:id', async (req, res) => {
    let id = req.params.id
    const orders = await Order.find({});
    let user = await User.findOne({ userId: req.params.id }).exec();
    console.log(orders)
    res.render('user', { id , user})
})

loginRoute.get('/user/:id/json', async (req, res) => {
    let id = req.params.id
    const orders = await Order.find({});
    res.json({data: orders})
})

loginRoute.get('/user/:id/new', async (req, res) => {
    console.log(req.params.id)
    let user = await User.findOne({ userId: req.params.id }).exec();
    console.log(user)
    let userId = user.userId;
    let accountId = user.accountId;
    res.render('new', {
        userId,
        accountId
    })
})

loginRoute.post('/user/:id/new', async (req,res) => {
    const newOrder = new Order({
        title: req.body.title, 
        price: req.body.price, 
        userId: req.body.userId, 
        accountId: req.body.accountId,
    });
    await newOrder.save();
    console.log(newOrder)
    let userId = req.params.id;
    res.redirect('/login/user/' + userId + '')
})

loginRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/login")
})

module.exports = loginRoute;