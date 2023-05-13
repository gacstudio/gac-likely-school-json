const sqlite3= require("sqlite3").verbose();
const fs = require("fs");

const path = require("path");

const session = require('express-session');
var bodyParser = require('body-parser');

var express = require("express");
var app = express();
var server = require("http").createServer(app);

let sql;

const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.error(err.message);
})

// sql = `CREATE TABLE users (
//     id INTEGER PRIMARY KEY ,
//     name varchar(100) not null,
//     surname varchar(100) not null,
//     username varchar(100) not null,
//     password varchar(64) not null,
//     email varchar(319) not null,
//     role int CHECK(role BETWEEN 1 AND 4)
// )`
// db.run(sql,(err,db)=>{
//     if(err) return console.error(err.message)
// })

// sql = `INSERT INTO users(
//     id,
//     name,
//     surname,
//     username,
//     password,
//     email,
//     role
// )VALUES (?,?,?,?,?,?,?)`
// db.run(sql,[null,"admin","admin","admin","8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918","admin@admin.com",1],(err,db)=>{
//     if(err) return console.error(err.message)
// })

sql = `SELECT * FROM users`
db.all(sql,(err,rows)=>{
    if(err) return console.error(err.message)
    rows.forEach((row)=>{
        console.log(row)
    })
})
const GC_Database=require("./modules/sqlite")
const Params = require("./modules/params")
var si = new GC_Database("./prova.db")
si.createTable("aaaa",
[
    new Params("Ciao","varchar(20)",true,false,""),
    new Params("Coglione", "varchar(10)",false,true,"")
])
si.readTable("aaaa")

//SETUP
app.use(session({
    secret: 'daffy-duck',
    resave: false,
    saveUninitialized: false
  }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//ROUTES
app.get('/', (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render('index', { title: 'Home' });
});

app.get('/books', (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render('books', { title: 'Library' });
});
app.get('/retrieval', (req, res) => {
    req.session.previousPage = req.originalUrl;
    
    res.render('retrieval', { title: 'Retrieval' });
})
app.get('/tutors', (req, res) => {
    req.session.previousPage = req.originalUrl;
    
    res.render('tutors', { title: 'Tutoring' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Profile' });
});

app.get('/back', (req, res) => {
  res.redirect(req.session.previousPage || '/');
});

app.get('/sign', (req, res) => {
    res.render('sign', { title: 'Sign', action_destination:'/login'});
});

app.post('/login', (req, res) =>{
    console.log(req.headers["user-agent"]);
    res.redirect('/');
});
server.listen(3000);