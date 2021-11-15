const express = require('express')
const app = express()

// загрузка файла через  require
const fileData = require('./test.json')
// настройка параметров шаблонизатора
app.set('view engine', 'pug');

app.get('/', (req,res) => {
    // рендер просит на вход первым параметром название шаблон-страницы без расширения
    // вторым объект данных
   res.render('index',{
       product: fileData
   })
})

app.listen(8000)