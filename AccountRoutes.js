const express = require('express')
const AccountRoute = express.Router();
const mongoose = require('mongoose');
const { User, Account } = require('./model.js');

AccountRoute.use(function timeLog(req, res, next) {
    next();
});

AccountRoute.get('/', async (req, res) => {
  const accounts = await Account.find();
  console.log(accounts)
  res.render('accounts/accounts', {
    accounts,
  })
});

AccountRoute.get('/new', (req, res) => {
  res.render('accounts/new');
});

AccountRoute.post('/new', async (req, res) => {
  let c = await Account.count({}) + 1;
  console.log('count', c);
  const newAccount = new Account({titleAccount: req.body.titleAccount, accountId: c});
  await newAccount.save();
  res.redirect('/accounts');
})

AccountRoute.get('/delete/:_id', async (req, res) => {
  Account.find({_id: req.params._id}).remove().exec();
  res.redirect('/accounts');
})

AccountRoute.get('/:id/users', async (req, res) => {
  const users = await User.find({ accountId: req.params.id });
  console.log(users);
  res.render('users/users', {
    users,
  })
});

module.exports = AccountRoute;
