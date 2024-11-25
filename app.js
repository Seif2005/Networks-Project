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
/*

app.get('/',function(req,res){
  res.render('bali')
});
app.get('/biko',function(req,res){
  res.render('home')
});
//working with JSONs

let x = {name:'Seif',username:'user1',pass:"pass1"};
let y = JSON.stringify(x);
let z = JSON.parse(y);
console.log(x.name);
console.log(y);
*/


//our code is here
//connecting to MongoDB

const MongoClient = require('mongodb').MongoClient;

(async () => {
    try {
        const client = await MongoClient.connect("mongodb://localhost:27017");
        const db = client.db('TestDB');
        await db.collection('FirstCollection').insertOne({
            id: 1,
            firstName: 'Seif',
            lastName: 'Hamdy'
        });
    } catch (err) {
        throw err;
    }
})();

app.get('/annapurna', function(req, res) {
  res.render('annapurna');
});

app.get('/bali', function(req, res) {
  res.render('bali');
});

app.get('/cities', function(req, res) {
  res.render('cities');
});

app.get('/hiking', function(req, res) {
  res.render('hiking');
});

app.get('/home', function(req, res) {
  res.render('home');
});

app.get('/inca', function(req, res) {
  res.render('inca');
});

app.get('/index', function(req, res) {
  res.render('index');
});

app.get('/islands', function(req, res) {
  res.render('islands');
});

app.get('/', function(req, res) {
  res.render('login');
});

app.get('/paris', function(req, res) {
  res.render('paris');
});

app.get('/registration', function(req, res) {
  res.render('registration');
});

app.get('/rome', function(req, res) {
  res.render('rome');
});

app.get('/santorini', function(req, res) {
  res.render('santorini');
});

app.get('/searchresults', function(req, res) {
  res.render('searchresults');
});

app.get('/wanttogo', function(req, res) {
  res.render('wanttogo');
});

//close DB Connection
client.close();
//the port
app.listen(3000);

module.exports = app;
