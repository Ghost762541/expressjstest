const express = require('express')
const app = express()
const fs = require('fs')

app.get('/', (req,res) => {
   fs.readFile('test.txt', function(err,data) {
        if (err) { 
            console.error(err);
            return;
        } 
        var list = data.toString().split("\n").join("<br />");
        res.send(list);
    })
})

app.listen(8000)