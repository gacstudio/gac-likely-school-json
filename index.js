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
    secret: 'ultrinus',
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
    if (req.session.isLoggedIn) {
        res.render("books", { title: "Library" });
    } else {
        res.redirect('/login');
    }
});

app.get("/retrieval", (req, res) => {
    req.session.previousPage = req.originalUrl;
    if (req.session.isLoggedIn) {
        res.render("retrieval", { title: "Retrieval" });
    } else {
        res.redirect('/login');
    }
});

app.get("/tutors", (req, res) => {
    req.session.previousPage = req.originalUrl;
    readFile("./modules/config/users.json", (error, data) => {
        if (error) { console.log(error); return; }
        const users = JSON.parse(data);
        const usersOutput = users
        .filter(user => user.role === "TUTOR")
        .map(({ id, name, surname, username, email, role }) => ({ id, name, surname, username, email, role }));
        if (req.session.isLoggedIn) {
            res.render("tutors", { title: "Tutoring", users: usersOutput });
        } else {
            res.redirect('/login');
        }});
    });   

    

app.get("/profile", (req, res) => {
    console.log(req.query.id);
    if (req.session.isLoggedIn) {
        if(req.query.id){
            readFile("./modules/config/users.json", (error, data) => {
                if (error) { console.log(error); return; }
                const users = JSON.parse(data);

                if(user = users.find(user => user.id === req.query.id)){
                    res.render("profile", { title: "Profile", user: users.find(user => user.id == req.query.id) });
                }
            });
        } else{
            res.render("profile", { title: "Profile", user: req.session.user });
        }
    } else {
        res.redirect('/login');
    }
});

app.get("/back", (req, res) => {
    res.redirect(req.session.previousPage || "/");
});
app.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/login");
})
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
        //console.log(users);
        
        /**
         *     {
        "id": 2,
        "name": "Daniele",
        "surname": "Giacchè",
        "username": "dani2318",
        "email": "mail@mail.it",
        "password":"9125acdc004c33d61bb79666889492865dd58ace6fe30320422352d95ed77717",
        "role": "ADMIN"
    }
]
         */
        
        if (checkCredentials(users, username, c_password)) {
            user = users.find(us => us.username === username && us.password === c_password);
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log(user); // True
            res.redirect(`/`);
        } else {
            const message = 'Credenziali invalide';
            res.render('login', {title: "Login", message });
        }
    });
});
app.get('/register',(req, res)=>{
    res.render('register', {title: "Register"});
});

app.post('/register',(req, res) => {
    const { name, surname, username, email, password, role } = req.body;
    var c_password = createHash("sha256").update(password).digest("hex");

    readFile("./modules/config/users.json", (error, data) => {
        if (error) { console.log(error); return; }
        const users = JSON.parse(data);

        users.push({
            id: users.length+1,
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: c_password,
            role: role
        });
        writeFile("./modules/config/users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) { console.log(err); return; }
            res.redirect("/login", { title: "Login" });
            //console.log("Updated file successfully");
        });
    });
});

function checkCredentials(arr, username, password) {
    const user = arr.find(user => user.username === username && user.password === password);
    return user !== undefined;
}