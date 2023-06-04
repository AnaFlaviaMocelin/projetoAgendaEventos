const path = require("node:path");
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');


const authController = require('./controllers/auth.controller')
const eventsController = require("./controllers/events.controller");
const mongoClient = require("./database/mongo.db");

const config = require("./config");

const app = express();
const port = parseInt(config.getEnv("PORT", false, "3000"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
 }));

 passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  (accessToken, refreshToken, profile, cb) => {
      userProfile=profile;
      return cb(null, userProfile);
  }
));
app.use(passport.initialize());
app.use(passport.session());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK_URL
);

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      const user = await mongoClient.findUserByEmail(email);

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
  
  passport.deserializeUser( async (id, done) => {
    const user = await mongoClient.findUserByEmail(id);
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
  })
);

app.get("/auth/google", passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/events');
  }
);

app.get('/auth/callback', (req, res) => {
const code = req.query.code;
  if (code) {
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error on get access token', err);
      req.session.token = token;
      res.render('events'); 
    });
  }
});

app.get("/signup", authController.createAccount);
app.post("/signup/create", authController.signUp);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    console.error(err)
  });
  res.redirect('/');
});

app.listen(port, () => console.log(`Application has been started at ${port}`));
