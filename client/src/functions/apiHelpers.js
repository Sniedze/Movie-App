import axios from "axios";

const API_URL = "http://localhost:8080/";

const login = async (username, password) => {
  const response = await axios({
    url: `${API_URL}users/login`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { username, password },
  });
  return response;
};

const getAllMovies = async () => {
  const { data: movies } = await axios.get(`${API_URL}allmovies`);
  return movies;
};

const getUsersMovies = async () => {
  const userId = localStorage.getItem("user_id");
  const { data: movies } = await axios({
    url: `${API_URL}movies`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
      user_id: userId,
    },
  });
  return movies;
};

const addMovie = async (title, year) => {
  const user_id = localStorage.getItem("user_id");
  const response = await axios({
    url: `${API_URL}movies/addmovie`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    data: { title, year, user_id },
  });
  return response;
};

const updateMovie = async (id, watched) => {
  const response = await axios({
    url: `${API_URL}movies/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    data: { watched },
  });
  return response;
};

const deleteMovie = async (id) => {
  const response = await axios({
    url: `${API_URL}movies/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  return response;
};

export default {
  login,
  getAllMovies,
  getUsersMovies,
  updateMovie,
  deleteMovie,
  addMovie,
};
