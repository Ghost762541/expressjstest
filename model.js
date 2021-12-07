const express = require('express');
const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({titleUser: 'string', accountId: 'string', userId: 'number' });
const User = mongoose.model('User', Userschema);
const Accountschema = new mongoose.Schema({titleAccount: 'string', accountId: 'string'});
const Account = mongoose.model('Account', Accountschema);

module.exports = { User, Account };