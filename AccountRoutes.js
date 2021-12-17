const express = require('express')
const AccountRoute = express.Router();
const mongoose = require('mongoose');
const { User, Account, Order } = require('./model.js');
const moment = require('moment');
const { nanoid } = require('nanoid');
const md5 = require('md5');
const fileUpload = require('../lib/index');
const app = express();
const bodyParser = require('body-parser');

const uploadPath = '/home/user/tmp/files/';

AccountRoute.use(express.static(uploadPath));

AccountRoute.use(function timeLog(req, res, next) {
  next();
});

AccountRoute.use(fileUpload());

AccountRoute.get('/', async (req, res) => {
  const accounts = await Account.find();
  //await Account.find({}).remove().exec()
  console.log(accounts)
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

AccountRoute.get('/delete/:accountId', async (req, res) => {
  Account.deleteOne({accountId: req.params.accountId}).exec();
  res.redirect('/accounts');
})

AccountRoute.get('/:id/users', async (req, res) => {
  let accountId = req.params.id;
  let account = await Account.findOne({ accountId: req.params.id }).exec();
  console.log(account)
  let titleAccount = account.titleAccount
  res.render('accounts/users_list', {
    accountId,
    titleAccount
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

AccountRoute.get('/:accountId/delete/:id', async (req, res) => {
  let accountId = req.params.accountId;
  await User.find({userId: req.params.id}).remove().exec();
  res.redirect('/accounts/' + accountId + '/users');
})

AccountRoute.get('/:accountId/password/:id', async (req, res) => {
  let accountId = req.params.accountId;
  let password = nanoid();
  console.log(password);
  let passwordHash = md5(password);
  console.log(passwordHash);
  await User.updateOne({userId: req.params.id} , { $set: { passwordHash: passwordHash } }).exec();
  res.redirect('/accounts/' + accountId + '/users');
})

AccountRoute.get('/:accountId/profile/:userId/', async (req, res) => {
  let user = await User.findOne({userId: req.params.userId})
  res.render('users/profile', user);
})

AccountRoute.get('/:accountId/profile/:userId/upload', async (req, res) => {
  let accountId = req.params.accountId;
  let userId = req.params.userId;
  res.render('users/upload', {accountId, userId}) ;
})

AccountRoute.post('/:accountId/profile/:userId/upload', async (req, res) => {
  let accountId = req.params.accountId;
  let userId = req.params.userId;
  await console.log(req.files);
  let imgpath = req.params._id + ".png";
  req.files.img.mv(uploadPath + imgpath )
  await User.updateOne({userId: req.params.userId}, { $set: { imgpath: imgpath } }).exec();
  res.redirect('/accounts/' + accountId + '/profile/' + userId + '/')
})

AccountRoute.get('/:id/users/orders/json', async (req, res) => {
  const orders = await Order.find({ accountId: req.params.id });
  res.json(  { data: orders })
});

module.exports = AccountRoute;
