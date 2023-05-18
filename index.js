const GC_Database = require("./modules/sqlite");
const path = require("path");
const { createHash } = require("crypto");

const session = require("express-session");
const fs = require("fs");
var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");

//Server Config
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const SERVER_IP = config.SERVER_IP;
const SERVER_PORT = config.SERVER_PORT;
const VERBOSE = config.VERBOSE;
const VERBOSE_TYPE = config.VERBOSE_TYPE;
var DATABASE_NAME = String(config.DATABASE_NAME);

//DATABASE_NAME checks!
DATABASE_NAME.endsWith(".db") ? DATABASE_NAME : (DATABASE_NAME += ".db");

var app = express();
var server = require("http").createServer(app);

//DB Init
const db = new GC_Database(`./${DATABASE_NAME}`);

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
    if (
        (VERBOSE_TYPE.CONNECTION_VERBOSE && VERBOSE) ||
        (VERBOSE_TYPE.COMPLETE_VERBOSE && VERBOSE)
    )
        console.log("Sending login request result to " + req.ip);
    to_res
        .pop(req.body.ores)
        .redirect(
            `/?user_data=${req.body.result.replace("}", "").replace("{", "")}`
        );
});
app.post("/login", (req, res) => {
    if (
        (VERBOSE_TYPE.CONNECTION_VERBOSE && VERBOSE) ||
        (VERBOSE_TYPE.COMPLETE_VERBOSE && VERBOSE)
    )
        console.log(
            `Login request recived from ${req.ip} for ${req.body.username}`
        );

    var _u = req.body.username;
    var _p = req.body.pswd;
    if (_p == "" || _p == undefined) {
        res.redirect("/sign");
    }
    _p = createHash("sha256").update(_p).digest("hex");
    to_res.push(res);
    db.readTableWhereTo_Client(
        "users",
        ["id", "name", "surname", "email", "username"],
        `username='${_u}' and password='${_p}'`,
        `http://${SERVER_IP}:${SERVER_PORT}/success`,
        req,
        to_res.length,
        (VERBOSE_TYPE.QUERY_VERBOSE && VERBOSE) ||
            (VERBOSE_TYPE.COMPLETE_VERBOSE && VERBOSE)
    );
});
server.listen(SERVER_PORT);
console.log(`SERVER LISTENING TO: ${SERVER_IP}:${SERVER_PORT}`);
console.log(`SERVER CONTENT AT: http://${SERVER_IP}:${SERVER_PORT}/`);
