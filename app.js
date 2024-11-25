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

const MongoClient = require('mongodb').MongoClient;
let db;
let client;

async function connectToDatabase() {
    try {
        client = await MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('myDB');
        console.log("Connected to database:", db.databaseName);
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
}

connectToDatabase();

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
  res.render('index',{title:"Hi"});
});

app.get('/islands', function(req, res) {
  res.render('islands');
});

app.get('/', function(req, res) {
  res.render('login',{error:""});
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

app.post('/', async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let valid;

  try {
    valid = await db.collection('myCollection').findOne({ "username": username, "password": password });
  } catch (err) {
    console.error("Error during database operation:", err);
    return res.render('login', { error: "Database error!" });
  }

  if (valid != null) { // record is in database
    res.redirect('home');
  } else { // not logged in
    res.render('login', { error: "Invalid Account!" });
  }
});

//the port
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

process.on('SIGINT', () => {
    if (client) {
        client.close(() => {
            console.log('MongoDB client closed');
            process.exit(0);
        });
    }
});

module.exports = app;
