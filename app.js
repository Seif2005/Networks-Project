//importing packages
var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//our code is here
app.get('/',function(req,res){
  res.render('index',{title:"express"})
});

//the port
app.listen(3000);

module.exports = app;