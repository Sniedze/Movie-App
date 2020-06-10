const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
const nodemailer = require("nodemailer");
let config = require(__dirname + "/../config/email_config");
const User = require(__dirname + "/../models/User");

//******** Create password recovery token, and send it to user by email******/

router.post("/password/reset", async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.query().findOne({ email }).throwIfNotFound();
    const recover_password_token = crypto.randomBytes(32).toString("hex");
    const recover_password_exp_date = moment()
      .add(24, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    await User.query().findOne({ email }).patch({
      recover_password_token,
      recover_password_active: true,
      recover_password_exp_date,
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    var mailOptions = {
      from: config.email,
      to: email,
      subject: "Password reset token",
      text: `This is your password reset token: ${recover_password_token}! It expires on ${recover_password_exp_date}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(400).send({ error });
      } else {
        return res.status(200).send("Email sent: " + info.response);
      }
    });
  } catch (err) {
    next(err);
  }
});

//******** Path that accepts token and new password******/

router.post("/password/create", async (req, res, next) => {
  const { email, token, password, confirmPassword } = req.body;
  try {
    // Check if data exists
    if (!email && !token && !password && !confirmPassword) {
      return res.status(400).send({ response: "Invalid data" });
    }

    // Check both passwords match
    if (password != confirmPassword) {
      return res
        .status(400)
        .send({ response: "Password and confirm password do not match" });
    }

    // Data exists and is valid, continue with token check and update if valid

    const users = await User.query().select().where({ email }).limit(1);
    const user = users[0];
    console.log(user);
    if (token != user.recover_password_token) {
      return res.status(400).send({ response: "Invalid token" });
    }
    if (!user.recover_password_active) {
      return res.status(403).send({ response: "Forbidden access" });
    }

    //******** Create password recovery token, and send it to user by email******/

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    const passwordUpdate = await User.query().findOne({ email }).patch({
      password: hashedPassword,
      recover_password_active: false,
    });
    res.json({ response: "Password changed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
