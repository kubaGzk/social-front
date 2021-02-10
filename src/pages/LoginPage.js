import React, { useState } from "react";

import { Checkbox } from "semantic-ui-react";
import Login from "../forms/Login";
import Register from "../forms/Register";

const LoginPage = (props) => {
  const [currentPage, setPage] = useState("login");

  const switchPage = () => {
    const page = currentPage === "login" ? "register" : "login";
    setPage(page);
  };

  return (
    <div className="login-container">
      <Checkbox
        label={currentPage === "login" ? "To register" : "To login"}
        toggle
        onChange={switchPage}
        style={{ padding: "0.25rem" }}
      />
      {currentPage === "login" ? (
        <Login history={props.history} />
      ) : (
        <Register history={props.history} />
      )}
    </div>
  );
};

export default LoginPage;
