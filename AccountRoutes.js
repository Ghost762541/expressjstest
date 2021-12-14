const express = require('express')
const AccountRoute = express.Router();
const mongoose = require('mongoose');
const { User, Account } = require('./model.js');
const moment = require('moment');
const { nanoid } = require('nanoid');
const md5 = require('md5');

AccountRoute.use(function timeLog(req, res, next) {
    next();
});

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

module.exports = AccountRoute;
