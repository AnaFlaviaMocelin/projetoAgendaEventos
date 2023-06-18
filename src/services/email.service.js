const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0ba1edf6cff783",
    pass: "ceddf6ed6581ed",
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
