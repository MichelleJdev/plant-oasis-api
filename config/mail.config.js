const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

sgMail.setApiKey(SENDGRID_API_KEY);

const message = {
  from: {
    name: "Plant Oasis Online",
    email: FROM_EMAIL,
  },
};

module.exports = {
  sgMail,
  message,
};
