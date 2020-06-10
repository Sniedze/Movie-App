import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";
import Movies from "./pages/movies/Movies";
import AddMovies from "./pages/movies/AddMovies";
import PasswordReset from "./pages/login/PasswordReset";
import CreateNewPassword from "./pages/login/CreateNewPassword";
import Login from "./pages/login/Login";
import Navigation from "./components/navigation/Navigation";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    !!localStorage.getItem("token")
      ? setIsAuth((isAuth) => true)
      : setIsAuth((isAuth) => false);
  }, [isAuth]);

  const handleLogoutClick = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsAuth((isAuth) => false);
  };
  const handleLoginClick = () => {
    setIsAuth((isAuth) => true);
  };
  return (
    <Router>
      <div className="App">
        <Navigation handleLogoutClick={handleLogoutClick} isAuth={isAuth} />
        <Switch>
          <Route exact path="/" component={(props) => <Home {...props} />} />
          <ProtectedRoute
            exact
            path="/movies"
            component={(props) => <Movies {...props} />}
          />
          <ProtectedRoute
            exact
            path="/addmovies"
            component={(props) => <AddMovies {...props} />}
          />
          <Route
            exact
            path="/passwordreset"
            component={(props) => <PasswordReset {...props} />}
          />
          <Route
            exact
            path="/createpassword"
            component={(props) => <CreateNewPassword {...props} />}
          />

          <Route
            path="/login"
            component={(props) => (
              <Login {...props} handleLoginClick={handleLoginClick} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
