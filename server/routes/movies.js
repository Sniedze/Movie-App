const express = require("express");
const router = express.Router();
const Movie = require(__dirname + "/../models/Movie");
const { checkToken } = require(__dirname + "/../helpers/checkToken.js");

//******** Get all the movies if the user is authenticated******/

router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.query();
    res.json(movies);
  } catch (err) {
    next({ status: 400, response: "Failed to get movies" });
  }
});

//******** Get authorized user`s if the user is authenticated******/

router.get("/movies", checkToken, async (req, res, next) => {
  try {
    const movies = await Movie.query().where("user_id", req.headers.user_id);
    res.json(movies);
  } catch (err) {
    next({ status: 400, response: "Failed to get movies" });
  }
});

router.get("/:movieId/", checkToken, async (req, res, next) => {
  try {
    const movie = await Movie.query()
      .findById(req.params.movieId)
      .withGraphFetched("user");
    res.json(movie);
  } catch (err) {
    next({ status: 400, response: "Failed to get movies" });
  }
});

//******** Add new movie if the user is authenticated******/

router.post("/movies/addmovie", checkToken, async (req, res, next) => {
  const { title, year, user_id } = req.body;
  try {
    const movie = await Movie.query().insert({
      title,
      year,
      user_id,
    });
    return res.status(200).send({ movie });
  } catch (err) {
    next({ status: 400, response: "Failed to create a movie" });
  }
});

//******** Delete movie by id if the user is authenticated******/

router.delete("/movies/:id", checkToken, async (req, res, next) => {
  const { id } = req.params.id;

  try {
    const movie = await Movie.query().findById(req.params.id).throwIfNotFound();
    await movie.$query().delete();
    return res.status(200).send({ movie });
  } catch (err) {
    next({ status: 400, response: "Failed to delete a movie" });
  }
});

//******** Change movies status (watched or not) if the user is authenticated******/

router.patch("/movies/:id", checkToken, async (req, res, next) => {
  const { watched } = req.body;
  try {
    const movie = await Movie.query().findById(req.params.id).throwIfNotFound();
    await movie.$query().patch({ watched });
    return res.status(200).send({ movie });
  } catch (err) {
    next({ status: 400, response: "Failed to update movie" });
  }
});

module.exports = router;
