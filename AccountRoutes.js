const express = require('express')
const AccountRoute = express.Router();
const mongoose = require('mongoose');
const { User, Account } = require('./model.js');
const moment = require('moment');
const { nanoid } = require('nanoid');
const md5 = require('md5');
const fileUpload = require('../lib/index');
const app = express();
const bodyParser = require('body-parser');

const uploadPath = '/home/user/tmp/files/';

//app.use(express.static(__dirname + '/users/upload.pug'));
AccountRoute.use(express.static(uploadPath));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

AccountRoute.use(function timeLog(req, res, next) {
    next();
});

AccountRoute.use(fileUpload());

AccountRoute.get('/', async (req, res) => {
  const accounts = await Account.find();
  res.render('accounts/accounts', {
    accounts
  })
});

AccountRoute.get('/new', (req, res) => {
  res.render('accounts/new');
});

AccountRoute.post('/new', async (req, res) => {
  let c = await Account.count({}) + 1;
  const newAccount = new Account({
    titleAccount: req.body.titleAccount, 
    accountId: c
  });
  await newAccount.save();
  res.redirect('/accounts');
})

AccountRoute.get('/delete/:_id', async (req, res) => {
  Account.find({_id: req.params._id}).remove().exec();
  res.redirect('/accounts');
})

AccountRoute.get('/:id/users', async (req, res) => {
  let accountId = req.params.id;
  let account = await Account.findOne({ accountId: req.params.id });
  res.render('accounts/users_list', {
    accountId,
    account
  })
});

AccountRoute.get('/:id/users/json', async (req, res) => {
  const users = await User.find({ accountId: req.params.id });
  res.json(  { data: users })
});

AccountRoute.get('/:id/new', async (req, res) => {
  let accountId = req.params.id;
  res.render('accounts/new_user', {
    accountId
  })
})

AccountRoute.post('/:accountId/new', async (req, res) => {
  let userId = await User.count({}) + 1;
  let accountId = req.params.accountId;
  let date_created = moment();
  const newUser = new User({
    titleUser: req.body.titleUser, 
    accountId, 
    userId, 
    date_created: date_created.format('YYYY-MM-DD HH:mm:ss'), 
    mail: req.body.mail, 
    phone: req.body.phone,
  });
  await newUser.save();
  res.redirect('/accounts/' + accountId + '/users');
})

AccountRoute.get('/:accountId/delete/:_id', async (req, res) => {
  let accountId = req.params.accountId;
  await User.find({_id: req.params._id}).remove().exec();
  res.redirect('/accounts/' + accountId + '/users');
})

AccountRoute.get('/:accountId/password/:_id', async (req, res) => {
  let accountId = req.params.accountId;
  let password = nanoid();
  console.log(password);
  let passwordHash = md5(password);
  await User.updateOne({_id: req.params._id} , { $set: { passwordHash: passwordHash } }).exec();
  res.redirect('/accounts/' + accountId + '/users');
})

AccountRoute.get('/:accountId/profile/:_id/', async (req, res) => {
  let user = await User.findOne({_id: req.params._id})
  //console.log(user)
  //let accountId = req.params.accountId;
  //res.redirect('/accounts/' + accountId + '/users');
  res.render('users/profile', user);
})

AccountRoute.get('/:accountId/profile/:_id/upload', async (req, res) => {
  //res.redirect('/accounts/' + accountId + '/users');
  let accountId = req.params.accountId;
  let userId = req.params._id;
  res.render('users/upload', {accountId, userId}) ;
})

AccountRoute.post('/:accountId/profile/:_id/upload', async (req, res) => {
  let accountId = req.params.accountId;
  let userId = req.params._id;
  //let accountId = req.params.accountId;
  //res.redirect('/accounts/' + accountId + '/users');
  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }
  await console.log(req.files);
  let imgpath = req.params._id + ".png";
  req.files.img.mv(uploadPath + imgpath )
  
  await User.updateOne({_id: req.params._id}, { $set: { imgpath: imgpath } }).exec();
  
  //res.json(imgpath);
  //console.log(_dirname);
  res.redirect('/accounts/' + accountId + '/profile/' + userId + '/')
})

module.exports = AccountRoute;
