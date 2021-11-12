var express = require('express')
var app = express()

app.get('/', function (req, res){
    res.send('testik')
}) 

app.listen(8000, function(){
    console.log('e')
})