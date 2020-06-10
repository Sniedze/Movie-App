import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const CreateNewPassword = ({ url }) => {
  const history = useHistory();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if ((email, token, password, confirmPassword)) {
      fetch(`${url}password/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      }).then((res) => {
        if (res.status === 200) {
          history.replace("/login");
        }
      });
    } else {
      setMessage("Invalid Data");
    }
  };
  return (
    <div>
      <h3>Create New Password</h3>
      <form method="POST">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          name="token"
          placeholder="Token"
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </form>
      <h3>{message}</h3>
    </div>
  );
};

export default CreateNewPassword;
