//importing packages
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//our code is here
/*
app.get('/',function(req,res){
  res.render('index',{title:"express"})
});
//receiving the data
let data;
app.post('/',function(req,res){
  data = req.body.user;
  console.log(data);
  res.render('index',{title:"express"})
});
*/

app.get('/',function(req,res){
  res.render('login')
});
//working with JSONs
/*
let x = {name:'Seif',username:'user1',pass:"pass1"};
let y = JSON.stringify(x);
let z = JSON.parse(y);
console.log(x);
console.log(y);
console.log(z);
//write into json file
fs.writeFileSync('users.json',y);
let data = fs.readFileSync('users.json')
let dataReturned = JSON.parse(data)
console.log(dataReturned)
*/
//connecting to MongoDB
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017",function(err,client){
  if(err){
    throw err;
  }
  var db = client.db('TestDB');
  db.collection('FirstCollection').insertOne({id:1,firstName:'Seif',lastName:'Hamdy'});
});

//the port
app.listen(3000);

module.exports = app;
