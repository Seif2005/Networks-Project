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
//vars to use
let searchResults = [];
//helper functions
function findSubstring(word, array) {
  let destinations = [];
  if(word.length==0){
    return destinations;
  }
  for (let str of array) {
      if (str.includes(word)) {
          destinations.push(str)
      }
  }
  return destinations;
}

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

app.get('/islands', function(req, res) {
  res.render('islands');
});

app.get('/', function(req, res) {
  let message = req.query.message || "";
  res.render('login',{error:"",message});
});

app.get('/paris', function(req, res) {
  res.render('paris');
});

app.get('/registration', function(req, res) {
  res.render('registration',{error:""});
});

app.get('/rome', function(req, res) {
  res.render('rome');
});

app.get('/santorini', function(req, res) {
  res.render('santorini');
});

app.get('/searchresults', function(req, res) {
  res.render('searchresults',{searchResults:searchResults});
});

app.get('/wanttogo', function(req, res) {
  res.render('wanttogo');
});

app.post('/', async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let valid;

  if(!username || !password){
    return res.render('login', { error: "Please enter username and password" ,message:""});
  }
  try {
    valid = await db.collection('myCollection').findOne({ "username": username, "password": password });
  } catch (err) {
    console.error("Error during database operation:", err);
    return res.render('login', { error: "Database error!" ,message:""});
  }

  if (valid != null) { // record is in database
    res.redirect('home');
  } else { // not logged in
    res.render('login', { error: "Invalid Account!",message:"" });
  }
});

app.post('/registration', async function(req, res) {
  let username1 =req.body.username;
  let password1  = req.body.password;

  if(!username1 || !password1){
    return res.render('registration', { error: "Please enter username and password" });
  }
  try {
    let UserExist = await db.collection('myCollection').findOne({ username: username1 });
    if (UserExist) {
      return res.render('registration', { error: "Username already exists!" });
    }

    await db.collection('myCollection').insertOne({ username: username1, password: password1 });
    console.log("User registered:", username1);

    res.redirect('/?message=Registered successfully, please login');
    //res.redirect('/');
  } catch (err) {
    console.error("Error during registration:", err);
    res.render('registration');
  }
});
//search feature
app.post('/search',async function (req,res) {
  //res.redirect('/searchfail');
  let searched = req.body.Search.toLowerCase();
  let locationsAvailable = ['annapurna','bali','inca','paris','rome','santorini'];
  let funcRes = findSubstring(searched,locationsAvailable);
  //returns no match
  if(funcRes.length==0){
    searchResults = [];
    //console.log(searchResults);
    res.redirect('/searchresults');
  }else{
    let singleRes;
    searchResults = [];
    for (let wanted of funcRes){
      if (wanted === 'annapurna') {
        singleRes = {
          searchResult: "Annapurna",
          searchedImageSrc: "/annapurna.png",
          goToLocation: "/annapurna"
        };
      } else if (wanted === 'bali') {
        singleRes = {
          searchResult: "Bali",
          searchedImageSrc: "/bali.png",
          goToLocation: "/bali"
        };
      } else if (wanted === 'inca') {
        singleRes = {
          searchResult: "Inca",
          searchedImageSrc: "/inca.png",
          goToLocation: "/inca"
        };
      } else if (wanted === 'paris') {
        singleRes = {
          searchResult: "Paris",
          searchedImageSrc: "/paris.png",
          goToLocation: "/paris"
        };
      } else if (wanted === 'rome') {
        singleRes = {
          searchResult: "Rome",
          searchedImageSrc: "/rome.png",
          goToLocation: "/rome"
        };
      } else if (wanted === 'santorini') {
        singleRes = {
          searchResult: "Santorini",
          searchedImageSrc: "/santorini.png",
          goToLocation: "/santorini"
        };
      }
      searchResults.push(singleRes);
    }
    //console.log(searchResults);
    return res.redirect('/searchresults');
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
