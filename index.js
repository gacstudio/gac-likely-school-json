const sqlite3 = require("sqlite3").verbose();
const GC_Database = require("./modules/sqlite");
const Params = require("./modules/params");
const path = require("path");
const fs = require("fs");

const session = require("express-session");
var bodyParser = require("body-parser");

var express = require("express");
var app = express();
var server = require("http").createServer(app);
let sql;
const db = new GC_Database("./database.db");

db.readTable("users");
var si = new GC_Database("./prova.db");
si.readTable("aaaa");
//SETUP
app.use(
    session({
        secret: "daffy-duck",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//ROUTES
app.get("/", (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render("index", { title: "Home" });
});

app.get("/books", (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render("books", { title: "Library" });
});
app.get("/retrieval", (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render("retrieval", { title: "Retrieval" });
});
app.get("/tutors", (req, res) => {
    req.session.previousPage = req.originalUrl;

    res.render("tutors", { title: "Tutoring" });
});

app.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

app.get("/back", (req, res) => {
    res.redirect(req.session.previousPage || "/");
});

app.get("/sign", (req, res) => {
    res.render("sign", { title: "Sign", action_destination: "/login" });
});

app.post("/login", (req, res) => {
    console.log(req.headers["user-agent"]);
    res.redirect("/");
});
server.listen(3000);
