const path = require("node:path");

const express = require("express");
const bodyParser = require("body-parser");

const authController = require('./controllers/auth.controller')
const eventsController = require("./controllers/events.controller");

const config = require("./config");

const app = express();
const port = parseInt(config.getEnv("PORT", false, "3000"));

app.use(bodyParser.urlencoded({ extended: true }));

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
app.post("/signin", authController.signIn);

app.get("/signup", authController.createAccount);
app.post("/signup/create", authController.signUp);


app.listen(port, () => console.log(`Application has been started at ${port}`));
