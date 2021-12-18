const express = require('express');
const path = require('path');
const cfenv = require('cfenv');

const app = express();


app.use(express.static(__dirname + '/static'));

app.get('/details/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/LogInDetails.html'));
  if (process.env.NODE_ENV === 'production') {
    res.redirect("https://sat-dev.ausmsc01.pcf.dell.com/home");
  } else {
    res.redirect("http://127.0.0.1:6001/home");
  }

});
app.get('/', function (req, res) {
  if (process.env.NODE_ENV === 'production') {
    res.redirect("https://sat-sso.ausmsc01.pcf.dell.com/");
  } else {
    res.redirect("https://sat-sso.ausmsc01.pcf.dell.com/locallogin");
  }
});
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/index.html'));

});
var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, appEnv.bind, function () {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
