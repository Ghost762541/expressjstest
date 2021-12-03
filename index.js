//const { Button } = require("bootstrap");
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// загрузка файла через  require
const fileData = require('./test.json')
const schema = new mongoose.Schema({ title: 'string', accountId: 'number' });
const Account = mongoose.model('Account', schema);


mongoose.connect('mongodb://192.168.241.84:27017/test');


//настройка параметров шаблонизатора
app.set('view engine', 'pug');

// button.onclick = function() {
//     alert('Клик!');
//   };

app.get('/', async (req,res) => {
    const first = new Account({title: "first", accountId: 1});
    //await first.save();
    
    const accounts = await Account.find()
    console.log(accounts)
    res.render('index', {
        Account: first,
        accounts,
   })
})

app.get('/new', async (req, res) => {
    const first = new Account({title: "first", accountId: 1});
    await first.save();
    const accounts = await Account.find()
    res.redirect('back');
})

app.get('/delete/:_id', async (req, res) => {
    Account.find({_id: req.params._id}).remove().exec();
    res.redirect('back');
})

app.listen(3000)