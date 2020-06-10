//import { get } from "lodash";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
};

//******** Stores token in the local storage after user has logged in******/

export const authenticate = (data) =>
  fetch("http://localhost:8080/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then(({ token, user_id }) => {
        localStorage.setItem("token", `Bearer ${token}`);
        localStorage.setItem("user_id", user_id);
        return token;
      });
    }
  });

//******** User is authenticated if there is a valid token in her local storage******/

export const isAuthenticated = () => !!localStorage.getItem("token");

export default authenticate;
