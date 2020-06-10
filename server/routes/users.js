const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
let jwt = require("jsonwebtoken");
let config = require(__dirname + "/../config/session_config");
const saltRounds = 10;
const { checkToken } = require(__dirname + "/../helpers/checkToken");
const User = require(__dirname + "/../models/User");

//User Signup

router.post("/users/register", (req, res) => {
  const { username, email, password, repeatPassword } = req.body;

  if (username && password && repeatPassword && password === repeatPassword) {
    if (password.length < 8) {
      return res
        .status(400)
        .send({ response: "Password does not fulfill the requirements" });
    } else {
      bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if (error) {
          return res.status(500).send({});
        }
        try {
          const existingUser = await User.query()
            .select()
            .where({ username: username })
            .limit(1);

          if (existingUser[0]) {
            return res.status(404).send({ response: "User already exists" });
          } else {
            const newUser = await User.query().insert({
              username,
              email,
              password: hashedPassword,
            });

            return res
              .status(200)
              .send({ username: newUser.username, response: "User created" });
          }
        } catch (error) {
          return res
            .status(500)
            .send({ response: "Something went wrong with the database" });
        }
      });
    }
  } else if (password !== repeatPassword) {
    return res
      .status(404)
      .send({ response: "Password and repeat password are not the same" });
  } else {
    return res.status(404).send({ response: "Missing fields" });
  }
});

//User Login

router.post("/users/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const users = await User.query()
        .select()
        .where({ username: username })
        .limit(1);
      const user = users[0];

      if (!user) {
        return res.status(404).send({ response: "Wrong username or password" });
      }

      await bcrypt.compare(password, user.password, (error, isSame) => {
        if (error) {
          return res.status(500).send({ response: "Validation error" });
        }
        if (!isSame) {
          return res.status(404).send({ response: "Wrong user or password" });
        } else {
          let token = jwt.sign({ username: username }, config.secret, {
            expiresIn: "24h",
          });
          return res.status(200).send({
            success: true,
            response: `Successfully logged in`,
            token: token,
            user_id: user.id,
          });
        }
      });
    } else {
      return res.status(404).send({ response: "Missing username or password" });
    }
  } catch (err) {
    next({ status: 400, response: "Failed to get movies" });
  }
});

//Delete User

router.delete("/", checkToken, async (req, res, next) => {
  try {
    const user = await User.query().deleteById(req.session.user.id);
    if (user) {
      res.json({
        message: `User ${req.body.username} successfully deleted`,
      });
    } else {
      res.json({
        response: `Error deleting the user`,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
