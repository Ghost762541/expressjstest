//const { Button } = require("bootstrap");
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// загрузка файла через  require
const fileData = require('./test.json')
const schema = new mongoose.Schema({ title: 'string', accountId: 'number' });
const Account = mongoose.model('Account', schema);


mongoose.connect('mongodb://192.168.241.84:27017/test');
app.use(express.urlencoded({ extended: true }))

//настройка параметров шаблонизатора
app.set('view engine', 'pug');

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
    // const first = new Account({title: "first", accountId: 1});
    // await first.save();
    //const accounts = await Account.find()
    res.render('form')
    //res.redirect('/');

})

app.post('/new', async (req, res) => {
    console.log(req.body.title);
    // Account.count({}, function(err, result) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //         const first = new Account({title: req.body.title, accountId: result + 1});;
    //     }
    //   });
    Account.count({}, function( err, count){
        console.log( count );
    })
    let c = await Account.count({});
    console.log('count', c);
    const first = new Account({title: req.body.title, accountId: c});
    await first.save();
    res.redirect('/');
    //res.send("ok");
})

app.get('/delete/:_id', async (req, res) => {
    Account.find({_id: req.params._id}).remove().exec();
    res.redirect('/');
})

app.listen(3000)