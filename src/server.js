const path = require("node:path");

const express = require("express");
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


const authController = require('./controllers/auth.controller')
const eventsController = require("./controllers/events.controller");

const config = require("./config");

const app = express();
const port = parseInt(config.getEnv("PORT", false, "3000"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      const user = authController.users.find((user) => user.email === email);
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Senha incorreta' });
        }
      });
    })
  );
  
  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    const user = authController.users.find((user) => user.id === id);
    done(null, user);
  });

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// API
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Eventos
// TODO: Separar em outra rota
app.get("/events", eventsController.findManyEvents);
app.get("/events/new", eventsController.newEvent);
app.post("/events/create", eventsController.createEvent);

// Auth (Login + Criar conta)
// TODO: Separar em outra rota
app.get("/", authController.login);
app.post("/signin",  passport.authenticate('local', {
    successRedirect: '/events',
    failureRedirect: '/',
    failureFlash: true,
  }));

app.get("/signup", authController.createAccount);
app.post("/signup/create", authController.signUp);

app.get("/forgotPassword", authController.forgotPassword);

app.get("/verification", authController.verification);


app.listen(port, () => console.log(`Application has been started at ${port}`));
