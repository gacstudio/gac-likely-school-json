const GC_Database = require("./modules/sqlite");
const path = require("path");
const { createHash } = require("crypto");

const session = require("express-session");
const fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));

const SERVER_IP = config.SERVER_IP;
const SERVER_PORT = config.SERVER_PORT;
const DEBUG_LINES = config.VERBOSE;
var DATABASE_NAME = String(config.DATABASE_NAME);

DATABASE_NAME.endsWith(".db") ? DATABASE_NAME : (DATABASE_NAME += ".db");

var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var server = require("http").createServer(app);

const db = new GC_Database(`./${DATABASE_NAME}`);
var cors = require("cors");

app.use(
    cors({
        origin: `http://${SERVER_IP}:${SERVER_PORT}/`,
        methods: ["GET", "POST"],
    })
);
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
    res.render("index", {
        title: "Home",
        server: `http://${SERVER_IP}:${SERVER_PORT}`,
    });
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

var to_res = [];
app.post("/success", (req, res) => {
    if (DEBUG_LINES) console.log("sending login request result to " + req.ip);

    var result = req.body.result;
    var res = to_res.pop(req.body.ores);
    res.redirect(`/?user_data=${result}`);
});
var to_res_count = to_res.length;
app.post("/login", (req, res) => {
    if (DEBUG_LINES) console.log("login request recived from " + req.ip);

    var username = req.body.username;
    var pswd = req.body.pswd;
    if (pswd == "" || pswd == undefined) {
        res.redirect("/sign");
    }
    pswd = createHash("sha256").update(pswd).digest("hex");
    to_res.push(res);
    db.readTableWhereToClient(
        "users",
        ["id", "name", "surname", "email", "username"],
        `username='${username}' and password='${pswd}'`,
        "http://localhost:3000/success",
        req,
        to_res_count
    );
});
server.listen(SERVER_PORT);
console.log(`SERVER LISTENING TO: ${SERVER_IP}:${SERVER_PORT}`);
console.log(`SERVER CONTENT AVAIBLE AT: http://${SERVER_IP}:${SERVER_PORT}/`);
