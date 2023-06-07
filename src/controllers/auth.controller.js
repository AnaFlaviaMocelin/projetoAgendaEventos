const mongoClient = require("../database/mongo.db");
const passwordService = require("../services/password.service");

const crypto = require("node:crypto");

module.exports = {
  login: function (req, res) {
    return res.render("sign-in", {
      message: req.flash("error"),
      success: req.flash("success")[0],
    });
  },
  signIn: function (req, res) {
    const { body } = req;
    const email = body?.email;
    const password = body?.password;

    if (!email) {
      return req.flash("error", "Campo de E-mail é obrigatório!");
    }

    if (!password) {
      return req.flash("error", "Campo de password é obrigatório!");
    }

    const user = mongoClient.findUserByEmail(email);

    if (!user) {
      return req.flash("error", "Usuário não existe na plataforma!");
    }
    const isPasswordMatching = password === user.password;
    if (!isPasswordMatching) {
      return req.flash("error", "Senha incorreta!");
    }
    return res.redirect("/events");
  },
  createAccount: function (req, res) {
    return res.render("sign-up");
  },
  signUp: function (req, res) {
    const { body } = req;
    const email = body?.email;
    const password = body?.password;

    if (!email) {
      return req.flash("error", "Campo de E-mail é obrigatório!");
    }

    if (!password) {
      return req.flash("error", "Campo de password é obrigatório!");
    }

    const hashedPass = passwordService.hash(password);

    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: hashedPass,
    };

    mongoClient.createUser(user);

    return res.redirect("/events");
  },
  forgotPassword: function (req, res) {
    return res.render("forgot-password");
  },
  verification: function (re, res) {
    return res.render("verification");
  },
};
