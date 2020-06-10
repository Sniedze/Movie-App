import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import styles from "./Login.module.css";
import apiHelpers from "../../functions/apiHelpers";

const Login = ({ handleLoginClick }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username && !password) {
      setError("Please enter valid username and password");
      return;
    }
    try {
      const res = await apiHelpers.login(username, password);
      if (res.status === 200) {
        localStorage.setItem("token", `Bearer ${res.data.token}`);
        localStorage.setItem("user_id", res.data.user_id);
        history.replace("/movies");
        handleLoginClick();
      }
    } catch (err) {
      setError("Invalid data");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form method="POST">
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" onClick={handleLogin}>
          Log in
        </button>
      </form>
      <NavLink to="/passwordreset">Forgot Password?</NavLink>
      <h2 className={styles.error}>{error}</h2>
    </div>
  );
};

export default Login;
