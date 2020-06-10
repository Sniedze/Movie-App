const express = require("express");
const cors = require("cors");
const { Model } = require("objection");
const Knex = require("knex");
const knexFile = require(__dirname + "/knexfile.js");
const rateLimit = require("express-rate-limit");
const movieRoute = require(__dirname + "/routes/movies");
const usersRoute = require(__dirname + "/routes/users.js");
const passwordResetRoute = require(__dirname + "/routes/password_reset.js");
const knex = Knex(knexFile.development);
const helmet = require("helmet");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // limit each IP to 4 requests per windowMs
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(helmet());

Model.knex(knex);

app.use("/users/login", authLimiter);
app.use("/users/register", authLimiter);

app.use(movieRoute);
app.use(usersRoute);
app.use(passwordResetRoute);

const port = process.env.PORT || 8080;

const server = app.listen(port, (error) => {
  if (error) {
    console.log("Error running Express");
  }
  console.log("Server is running on port", server.address().port);
});
