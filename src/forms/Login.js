import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/graphql";
import { useForm } from "../util/hooks";

import { Button, Form } from "semantic-ui-react";

const INITIAL_STATE = {
  username: "",
  password: "",
};

const Login = (props) => {
  const { login } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const [values, onChange, onSubmit] = useForm(loginHandler, INITIAL_STATE);

  const [userLogin, { loading }] = useMutation(LOGIN_USER, {
    update: (_, result) => {
      const {
        data: {
          login: { id, email, token, firstname, lastname, image },
        },
      } = result;

      login(token, firstname, lastname, image, id, email);
      props.history.push("/");
    },

    onError: ({ graphQLErrors, networkError }) => {
      if (networkError) {
        console.log(networkError);
        setErrors({
          general:
            "Unexpected issue occured, please try again later or contact Admin.",
        });
      }

      if (
        graphQLErrors &&
        graphQLErrors[0] &&
        graphQLErrors[0]?.extensions?.exception?.errors
      ) {
        setErrors(graphQLErrors[0].extensions.exception.errors);
      } else {
        setErrors({
          general:
            "Unexpected issue occured, please try again later or contact Admin.",
        });
      }
    },
    variables: values,
  });

  function loginHandler() {
    userLogin();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1 className="page-title">Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          type="text"
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
          type="password"
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
