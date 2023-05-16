const sqlite3 = require("sqlite3").verbose();
const GC_Database = require("./modules/sqlite");
const Params = require("./modules/params");
const path = require("path");
const fs = require("fs");
const { createHash } = require("crypto");

const session = require("express-session");
var bodyParser = require("body-parser");

var express = require("express");
var app = express();
var server = require("http").createServer(app);
let sql;
const db = new GC_Database("./database.db");
app.use(
    session({
        secret: "daffy-duck",
        resave: false,
        saveUninitialized: false,
    })
);
//db.readTable("users", ["name", "surname", "username"]);
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

var connectedUsers = [];

app.post("/success", (req, res) => {
    var result = req.body.result
        .replace("[{", "")
        .replace("}]", "")
        .replace('"', "")
        .split(",");
    connectedUsers.push(req.body.result);
    console.log("Login Successfull\n", result);
});

app.post("/login", (req, res) => {
    console.log(req);
    var username = req.body.username;
    var pswd = req.body.pswd;
    if (pswd == "" || pswd == undefined) {
        res.redirect("/sign");
    }
    pswd = createHash("sha256").update(pswd).digest("hex");
    console.log(pswd);
    db.readTableWhere(
        "users",
        ["id", "name", "surname", "email", "username"],
        `username='${username}' and password='${pswd}'`,
        "http://localhost:3000/success"
    );
    res.redirect("/");
});
server.listen(3000);
