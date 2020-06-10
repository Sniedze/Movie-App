import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import apiHelpers from "../../functions/apiHelpers";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const movies = await apiHelpers.getAllMovies();
      const uniqueMovies = [...new Set(movies.map((obj) => obj.title))].map(
        (title) => {
          return movies.find((obj) => obj.title === title);
        }
      );

      setMovies((movies) => uniqueMovies);
    };
    fetchAllMovies();
  }, []);

  return (
    <div className={styles.movies}>
      <h1>Recommended Movies</h1>
      {movies.length > 0 ? (
        <ul>
          {movies.map((movie, index) => (
            <li className={styles.li} key={index}>
              <h4 className={styles.h4}>{movie.title}</h4>
              <h4 className={styles.h4}>{movie.year}</h4>
            </li>
          ))}
        </ul>
      ) : (
        <h3>There are no movies to show.</h3>
      )}
    </div>
  );
};

export default Home;
