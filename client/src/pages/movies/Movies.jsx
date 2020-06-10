import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Movies.module.css";
import apiHelpers from "../../functions/apiHelpers";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsersMovies = async () => {
      const movies = await apiHelpers.getUsersMovies();
      setMovies(movies);
    };
    fetchUsersMovies();
  }, []);

  const updateStatus = async (e, movieId, watched, title) => {
    try {
      e.stopPropagation();
      const res = await apiHelpers.updateMovie(movieId, watched);
      if (res.status === 200) {
        setMovies(
          movies.map((movie) => (movie.id === movieId ? res.data.movie : movie))
        );

        watched
          ? setMessage(`Marked movie ${title} as watched`)
          : setMessage(`Marked movie ${title} as NOT watched`);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const deleteMovie = async (e, id, title) => {
    try {
      e.stopPropagation();
      const res = await apiHelpers.deleteMovie(id);
      if (res.status === 200) {
        setMessage(`Movie ${title} deleted`);
        document.getElementById(id).remove();
      }
    } catch (err) {
      setMessage(`Failed to delete ${title}`);
    }
  };

  return (
    <>
      {movies.length > 0 ? (
        <div className={styles.container}>
          <h1>My Movies</h1>
          <h3 className={styles.message}>{message}</h3>
          <NavLink
            activeClassName="active"
            to={{ pathname: "/addmovies", state: { usersMovies: movies } }}
          >
            Add Movies
          </NavLink>
          <table className={styles.movies}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Watched</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={index} id={movie.id}>
                  <td className={movie.watched ? styles.watched : ""}>
                    {movie.title}
                  </td>
                  <td className={movie.watched ? styles.watched : ""}>
                    {movie.year}
                  </td>
                  <td>
                    <div
                      className={
                        movie.watched ? styles.checkboxWatched : styles.checkbox
                      }
                      onClick={(e) => {
                        let isWatched = !movie.watched;
                        let movieId = movie.id;
                        updateStatus(e, movieId, isWatched, movie.title);
                      }}
                      id="isWatched"
                    >
                      <span
                        id={`span${movie.id}`}
                        className={
                          movie.watched ? styles.spanStyle : styles.hidden
                        }
                      >
                        ✔
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="button delete-button"
                      onClick={(e) => {
                        let movieId = movie.id;
                        let movieTitle = movie.title;
                        deleteMovie(e, movieId, movieTitle);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3>You haven`t added any movie to the list.</h3>
          <NavLink
            activeClassName="active"
            to={{ pathname: "/addmovies", state: { usersMovies: movies } }}
          >
            Add Movies
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Movies;
