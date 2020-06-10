import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const PasswordReset = ({ url }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    setSubmitted(true);
    event.preventDefault();
    if (email) {
      fetch(`${url}password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.body.token);
        }
      });
    } else {
      setMessage("Invalid Data");
    }
  };
  return (
    <div>
      <h2>Request a New Password</h2>
      {submitted ? (
        <div>
          <h3>WE emailed you the token to reset your password.</h3>
          <NavLink to="/createpassword">Create the new password here</NavLink>
        </div>
      ) : (
        <div>
          <p>
            It happens to the best of us. Enter your email and we'll send you
            reset instructions.
          </p>
          <form method="POST">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSubmit}>Request new password</button>
          </form>
          <NavLink to="/login">I remember my passowrd</NavLink>
        </div>
      )}
      {message}
    </div>
  );
};

export default PasswordReset;
