const nodemailer = require("nodemailer");

const credentials = require("../config/credentials");

const mailTransporter = nodemailer.createTransport({
  host: credentials.email.host,
  port: credentials.email.port,
  auth: {
    user: credentials.email.user,
    pass: credentials.email.password,
  },
});

module.exports = {
  sendEmail: async function ({ from, to, subject, html }) {
    try {
      const info = await mailTransporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log(info);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
