const path = require("node:path");
const crypto = require("node:crypto");

const express = require("express");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const authController = require("./controllers/auth.controller");
const eventsController = require("./controllers/events.controller");

const mongoClient = require("./database/mongo.db");

const mongoUserRepository = require("./repositories/mongo-user.repository");

const credentials = require("./config/credentials");
const config = require("./config/get-env");
const signInUsecase = require("./usecases/sign-in.usecase");
const passwordService = require("./services/password.service");

const app = express();
const port = parseInt(config.getEnv("PORT", false, "3000"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({ secret: "mySecret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const { success, data, error } = await signInUsecase(
        { email, password },
        mongoUserRepository,
        passwordService
      );

      if (!success) {
        console.log(success, data, error, { email, password, done });
        return done(null, false, {
          message: "Usuário não autenticado.",
        });
      }

      const { user } = data;

      return done(null, user);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: credentials.google.clientId,
      clientSecret: credentials.google.clientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      userProfile = profile;

      console.log({
        accessToken,
        refreshToken,
        profile,
      });

      return done(null, userProfile);
    }
  )
);

passport.serializeUser(async (data, done) => {
  console.log("serializeUser", data);

  let email = data.hasOwnProperty("email") ? data.email : null;

  // google serialize
  if (data.hasOwnProperty("_json")) {
    const googleData = data["_json"];
    email = googleData?.email;
  }

  if (!email) {
    return done(new Error("Error serializing user"), null);
  }

  const user = await mongoUserRepository.findUserByEmail(email);

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: email,
      password: "empty:empty",
    };
    console.log("user does not exists, creating it", user);
    await mongoUserRepository.createUser(user);
  }

  return done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  console.log("deserializeUser", { email });

  const user = await mongoUserRepository.findUserByEmail(email);

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
app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/events",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  async function (req, res) {
    console.log(req.body, req.headers, "redirect");
    return res.redirect("/events");
  }
);

app.get("/signup", authController.createAccount);
app.post("/signup/create", authController.signUp);

app.get("/forgotPassword", authController.forgotPassword);
app.post("/sendEmailToResetPassword", authController.sendEmailToResetPassword);
app.get("/verification", authController.verification);
app.post("/resetPassword", authController.resetPassword);

app.listen(port, async () => {
  console.log(`Application has been started at ${port}`);

  console.log("Connecting to mongo db");

  await mongoClient
    .connect()
    .catch(console.error)
    .then(() => console.log("Connected to mongodb server"));
});
