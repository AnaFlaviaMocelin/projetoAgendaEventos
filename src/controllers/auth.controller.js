const crypto = require("node:crypto");

const mongoUserRepository = require("../repositories/mongo-user.repository");
const memoryMapRepository = require("../repositories/memory-map.repository");

const passwordService = require("../services/password.service");
const emailService = require("../services/email.service");
const templateService = require("../services/template.service");

const signInUseCase = require("../usecases/sign-in.usecase");

const emailVerificationFile = "email-verification.json";

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
      isGoogleUser: false,
    };

    await mongoUserRepository.createUser(user);

    return res.redirect("/events");
  },
  forgotPassword: function (req, res) {
    return res.render("forgot-password");
  },
  sendEmailToResetPassword: async function (req, res) {
    const { email } = req.body;

    const code = crypto.randomUUID();

    console.log("sending email to reset password", email, code);

    console.log("saving into temp json-db");

    await memoryMapRepository
      .add(email, code)
      .saveAsFile(emailVerificationFile);

    const link = `http://localhost:3000/verification?email=${email}&code=${code}`;

    const forgotPasswordHtml = await templateService.renderAsHtmlString(
      "email-to-reset-password.ejs",
      {
        email: email,
        link: link,
      }
    );

    console.log("sending email", link, forgotPasswordHtml);

    const isEmailSended = await emailService.sendEmail({
      from: "noreply@plataformadeeventos.com.br",
      to: email,
      html: forgotPasswordHtml,
      subject: "Recuperação de senha",
    });

    console.log("email sended redirecting  to home", isEmailSended);

    return res.redirect("/");
  },
  verification: function (req, res) {
    if (!req.query?.email) {
      return req.flash("error", "Email invalido!");
    }
    if (!req.query?.code) {
      return req.flash("error", "Codigo invalido!");
    }
    const { email, code } = req.query;
    return res.render("verification", { email, code });
  },
  resetPassword: async function (req, res) {
    const { email, code, password } = req.body;

    console.log("resetpassword", email, code, password);

    const user = await mongoUserRepository.findUserByEmail(email);

    console.log("user", user);

    if (!user) {
      return req.flash("error", "Usuário não encontrado!");
    }

    await memoryMapRepository.loadFromFile(emailVerificationFile);

    console.log("checking memory code to validate");

    console.log(memoryMapRepository.debug());

    if (
      !memoryMapRepository.has(email) ||
      memoryMapRepository.get(email) !== code
    ) {
      console.log("invalid code");
      return req.flash("error", "Usuário não possui codigo de verificação!");
    }

    console.log("generating new password hash");

    const { hash, salt } = passwordService.hash(password);

    console.log("new password hash generated, updating user in db", hash, salt);

    const isUpdated = await mongoUserRepository.updateUser({
      ...user,
      password: `${hash}:${salt}`,
    });

    if (isUpdated) {
      console.log("deleting email verification code");
      await memoryMapRepository.delete(email).saveAsFile(emailVerificationFile);
    }

    console.log("user updated", isUpdated);

    return res.redirect("/");
  },
};
