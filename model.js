const express = require('express');
const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    titleUser: 'string', 
    accountId: 'string', 
    userId: 'number' , 
    date_created: 'string', 
    mail: 'string', 
    phone: 'string', 
    passwordHash: 'string' , 
    imgpath: 'string'
});
const User = mongoose.model('User', Userschema);

const Accountschema = new mongoose.Schema({
    titleAccount: 'string', 
    accountId: 'number'
});
const Account = mongoose.model('Account', Accountschema);

const OrderSchema = new mongoose.Schema({
    title: 'string',
    price: 'string',
    userId: 'number',
    accountId: 'number'
})
const Order = mongoose.model('Order', OrderSchema);

module.exports = { User, Account, Order };