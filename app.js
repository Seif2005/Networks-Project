//importing packages
var express = require('express');
var path = require('path');
const session = require('express-session');
var fs = require('fs');
const { Console, error } = require('console');

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

// Session middleware
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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


app.get('/', function(req, res) {
  let message = req.query.message || "";
  res.render('login',{error:"",message});
});

app.get('/registration', function(req, res) {
  res.render('registration',{error:""});
});

app.get('/annapurna', function(req, res) {
  if(req.session.logged){
    res.render('annapurna',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/bali', function(req, res) {
  if(req.session.logged){
    res.render('bali',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/cities', function(req, res) {
  if(req.session.logged){
    res.render('cities');
  }else{
    res.redirect("/");
  }
});

app.get('/hiking', function(req, res) {
  if(req.session.logged){
    res.render('hiking');
  }else{
    res.redirect("/");
  }
});

app.get('/home', async function(req, res) {
  if(req.session.logged){
    res.render('home');
  }else{
    res.redirect("/");
  }
});

app.get('/inca', function(req, res) {
  if(req.session.logged){
    res.render('inca',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/islands', function(req, res) {
  if(req.session.logged){
    res.render('islands');
  }else{
    res.redirect("/");
  }
});

app.get('/paris', function(req, res) {
  if(req.session.logged){
    res.render('paris',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/rome', function(req, res) {
  if(req.session.logged){
    res.render('rome',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/santorini', function(req, res) {
  if(req.session.logged){
    res.render('santorini',{message:"",error:""});
  }else{
    res.redirect("/");
  }
});

app.get('/searchresults', function(req, res) {
  if(req.session.logged){
    res.render('searchresults',{searchResults:searchResults});
  }else{
    res.redirect("/");
  }
});


app.get('/wanttogo', async function(req, res) {
  if(req.session.logged){
    const user = await db.collection('myCollection').findOne({ username: req.session.username });
    console.log('Want-To-Go List:', user.wantToGoList);
    res.render('wanttogo',{list:user.wantToGoList});
  }else{
    res.redirect("/");
  }
});

//posts
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
    req.session.username = username;
    console.log("Session Username: "+req.session.username);
    req.session.logged = true;
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

    await db.collection('myCollection').insertOne({ username: username1, password: password1 ,wantToGoList:[]});
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
app.post('/addToWantToGo', async (req, res) => {
  if (!req.session.logged) {
      return res.redirect('/');
  }

  const username = req.session.username;
  const destination = req.body.destination;
  const currentPage = req.body.currentPage;

  try {
    
    const user = await db.collection('myCollection').findOne({ username: username });

    if (user.wantToGoList.includes(destination)) {
      const message = `${destination} is already in your Want-To-Go list.`;
      return res.render(currentPage, { message:"" ,error: message, list: user.wantToGoList });
    }
      await db.collection('myCollection').updateOne(
          { username: username },
          { $addToSet: { wantToGoList: destination } } 
      );
      console.log(`Added ${destination} to ${username}'s Want-To-Go list.`);
      const message = `Successfully added ${destination} to your Want-To-Go list.`;

      res.render(currentPage, { message: message,error: "", list: user.wantToGoList }); 
  } catch (err) {
      console.error("Error updating Want-To-Go list:", err);
      res.status(500).send("Error updating Want-To-Go list");
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
