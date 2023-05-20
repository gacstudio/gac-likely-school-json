const { writeFile, readFile } = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const { createHash } = require('crypto');


//SERVER STARTING
var express = require("express");
var app = express();
var server = require("http").createServer(app);

app.use(session({
    secret: 'il_tuo_segreto_di_sessione',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 5 * 24 * 60 * 60 * 1000 // Durata di 5 giorni in millisecondi
    }
}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});


//ROUTES
app.get("/", (req, res) => {
    req.session.previousPage = req.originalUrl;
    if (req.session.isLoggedIn) {
        res.render("index", { title: "Home" });
    } else {
        res.redirect('/login');
    }
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
    readFile("./modules/config/users.json", (error, data) => {
        if (error) { console.log(error); return; }
        const users = JSON.parse(data);
        const usersOutput = users
            .filter(user => user.ruolo === 'Tutor')
            .map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
        res.render("tutors", { title: "Tutoring", users: usersOutput });
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

app.get("/back", (req, res) => {
    res.redirect(req.session.previousPage || "/");
});

// session starting

app.get("/login", (req, res) => {
    if (!req.session.isLoggedIn) { res.render('login', { title: 'Login', message: '' }); }
    else { res.redirect('/'); }
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    var c_password = createHash("sha256").update(password).digest("hex");

    readFile("./modules/config/users.json", (error, data) => {
        if (error) { console.log(error); return; }
        const users = JSON.parse(data);
        console.log(users);
        if (checkCredentials(users, username, c_password)) {
            req.session.isLoggedIn = true;
            res.redirect('/');
        } else {
            const message = 'Credenziali invalide';
            res.render('login', { message });
        }
    });
});

function checkCredentials(arr, username, password) {
    const user = arr.find(user => user.username === username && user.password === password);
    return user !== undefined;
}