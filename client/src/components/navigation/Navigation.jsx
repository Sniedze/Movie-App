import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = ({ isAuth, handleLogoutClick }) => {
  return (
    <nav className={styles.menu}>
      <>
        <NavLink
          className={styles.a}
          activeClassName={styles.active}
          to="/"
          exact
        >
          Home
        </NavLink>
        <NavLink
          className={styles.a}
          activeClassName={styles.active}
          to="/movies"
        >
          My Movies
        </NavLink>
        {isAuth ? (
          <NavLink
            className={styles.logoutA}
            to="/movies"
            onClick={handleLogoutClick}
          >
            Log out
          </NavLink>
        ) : (
          <NavLink
            className={styles.a}
            activeClassName={styles.active}
            to="/login"
          >
            Login
          </NavLink>
        )}
      </>
    </nav>
  );
};

export default Navigation;
