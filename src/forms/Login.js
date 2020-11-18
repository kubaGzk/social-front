import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState, useContext, useAuth } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const INITIAL_STATE = {
  username: "",
  password: "",
};

const Login = (props) => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const [values, onChange, onSubmit] = useForm(loginHandler, INITIAL_STATE);

  const [userLogin, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      const {
        data: {
          login: { id, email, token, firstname, lastname, image },
        },
      } = result;

      login(token, firstname, lastname, image, id, email);
      props.history.push("/");
    },

    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      firstname
      lastname
      token
      image
    }
  }
`;

export default Login;
