const crypto = require("node:crypto");

const mongoUserRepository = require("../repositories/mongo-user.repository");
const passwordService = require("../services/password.service");

const signInUseCase = require("../usecases/sign-in.usecase");

module.exports = {
  login: function (req, res) {
    return res.render("sign-in", {
      message: req.flash("error"),
      success: req.flash("success")[0],
    });
  },
  signIn: async function (req, res) {
    const { body } = req;

    console.log("signIn", body);

    const email = body?.email;
    const password = body?.password;

    if (!email) {
      return req.flash("error", "Campo de E-mail é obrigatório!");
    }

    if (!password) {
      return req.flash("error", "Campo de password é obrigatório!");
    }

    const { success } = await signInUseCase(
      { email, password },
      mongoUserRepository,
      passwordService
    );

    if (!success) {
      return req.flash(
        "error",
        "O email ou senha não está correto, verifique os dados."
      );
    }

    return res.redirect("/events");
  },
  createAccount: function (req, res) {
    return res.render("sign-up");
  },
  signUp: async function (req, res) {
    const { body } = req;

    console.log("signUp", body);

    const email = body?.email;
    const password = body?.password;

    if (!email) {
      return req.flash("error", "Campo de E-mail é obrigatório!");
    }

    if (!password) {
      return req.flash("error", "Campo de password é obrigatório!");
    }

    const { hash, salt } = passwordService.hash(password);

    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: `${hash}:${salt}`,
    };

    await mongoUserRepository.createUser(user);

    return res.redirect("/events");
  },
  forgotPassword: function (req, res) {
    return res.render("forgot-password");
  },
  verification: function (re, res) {
    return res.render("verification");
  },
};
