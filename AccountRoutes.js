const express = require('express')
const AccountRoute = express.Router();
const mongoose = require('mongoose')

const Accountschema = new mongoose.Schema({titleAccount: 'string', accountId: 'string'});
const Account = mongoose.model('Account', Accountschema);

AccountRoute.use(function timeLog(req, res, next) {
    next();
  });

  AccountRoute.get('/', async (req, res) => {
    const accounts = await Account.find()
    // console.log(accounts)
    res.render('accounts', {
        accounts,
   })
  });

  AccountRoute.get('/new', (req, res) => {
    res.render('newAccount')
  });

  AccountRoute.post('/new', (req, res) => {
    Account.count({}, function( err, count){
        console.log( count );
    })
    let c = Account.count({});
    console.log('count', c);
    const newAccount = new Account({titleAccount: req.body.titleAccount, accountId: c});
    newAccount.save();
    res.redirect('/accounts');
  })

  AccountRoute.get('/delete/:_id', async (req, res) => {
    Account.find({_id: req.params._id}).remove().exec();
    res.redirect('/accounts');
})

module.exports = AccountRoute;
