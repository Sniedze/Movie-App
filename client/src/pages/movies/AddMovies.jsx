import React, { useState } from "react";
import Search from "../../components/search/Search";
import styles from "./Movies.module.css";
import apiConfig from "../../api-key";
import apiHelpers from "../../functions/apiHelpers";

const AddMovies = (props) => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [message, setMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const search = (searchValue) => {
    setLoading(true);
    setErrorMessage(null);

    fetch(
      `https://www.omdbapi.com/?s=${searchValue}&apikey=${apiConfig.owmKey}`
    )
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.Response === "True") {
          setMovies(jsonResponse.Search);
          setLoading(false);
        } else {
          setErrorMessage(jsonResponse.Error);
          setLoading(false);
        }
      });
  };

  const handleMoviePick = (e, movieId) => {
    document
      .getElementById(`span${movieId}`)
      .classList.toggle(`${styles.hidden}`);
  };

  const handleAddMovie = async (event) => {
    event.preventDefault();
    const usersMovies = props.location.state.usersMovies;
    if (!movieTitle && !movieYear) {
      setMessage("Please enter something");
      return;
    }
    if (
      usersMovies.some(
        ({ title, year }) =>
          title.toLowerCase() === movieTitle ||
          (title === movieTitle && year === movieYear)
      )
    ) {
      setMessage(`Movie ${movieTitle} already exists in your list`);
      return;
    }
    const res = await apiHelpers.addMovie(movieTitle, movieYear);
    if (res.status === 200) {
      setMessage(`Movie ${movieTitle} added to your list`);
    } else setMessage(`Failed to add movie ${movieTitle} to the list`);
  };

  return (
    <>
      <h3>Add New Movie</h3>
      <form method="POST">
        <input
          type="text"
          name="title"
          placeholder="Title"
          defaultValue={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          onChange={(e) => setMovieYear(e.target.value)}
        />
        <button className="button" onClick={handleAddMovie}>
          Add movie
        </button>
      </form>
      <h3 className={styles.message}>{message}</h3>
      <h3>Or Search for the movie</h3>
      <Search search={search} />
      {movies ? (
        <div className={styles.results}>
          {loading && !errorMessage ? (
            <span>loading...</span>
          ) : errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
          ) : (
            movies.map((movie, index) => (
              <div className={styles.movie} key={`${index}-${movie.Title}`}>
                <h4>{movie.Title}</h4>

                <div>
                  {movie.Poster ? (
                    <img
                      width="200"
                      alt={`The movie titled: ${movie.Title}`}
                      src={movie.Poster}
                    />
                  ) : (
                    <img
                      width="200"
                      alt={`The movie titled: ${movie.Title}`}
                      src="https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
                    />
                  )}
                </div>
                <h4>{movie.Year}</h4>
                <div
                  className={styles.divStyle}
                  onClick={(e) => {
                    setMovieTitle(movie.Title);
                    setMovieYear(movie.Year);
                    let movieId = movie.imdbID;
                    handleMoviePick(e, movieId);
                  }}
                  id="isPicked"
                >
                  <span className={styles.hidden} id={`span${movie.imdbID}`}>
                    ✔
                  </span>
                </div>
                <button
                  onClick={(event) => {
                    handleAddMovie(event);
                  }}
                >
                  Add movie
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          <h2>{errorMessage}</h2>
        </div>
      )}
    </>
  );
};

export default AddMovies;
