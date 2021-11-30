const express = require('express');
const app = express();
const path = require('path');

//where we expose files or directories for public use
// app.use(express.static(path.join(__dirname , 'static')));
// console.log(path.join(__dirname , 'static'));
//where we set our routes
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: '.' });
});

app.listen(process.env.PORT || 5500);