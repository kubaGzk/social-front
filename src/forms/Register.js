import { useMutation } from "@apollo/react-hooks";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../util/graphql";
import { useForm } from "../util/hooks";

const INITIAL_STATE = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: "",
};

const Register = (props) => {
  const { login } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const [values, onChange, onSubmit] = useForm(registerHandler, INITIAL_STATE);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      const {
        data: {
          register: { id, email, token, firstname, lastname, image },
        },
      } = result;
      login(token,  firstname, lastname, image, id, email);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerHandler() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form  onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1 className="page-title">Register</h1>
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
          label="First name"
          placeholder="Firstname..."
          name="firstname"
          value={values.firstname}
          onChange={onChange}
          error={errors.firstname ? true : false}
          type="text"
        />
        <Form.Input
          label="Last name"
          placeholder="Lastname..."
          name="lastname"
          value={values.lastname}
          onChange={onChange}
          error={errors.lastname ? true : false}
          type="text"
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
          type="email"
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
        <Form.Input
          label="Confirm password"
          placeholder="Confirm password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
          type="password"
        />
        <Form.Input
          label="Image"
          name="image"
          onChange={onChange}
          error={errors.image ? true : false}
          type="file"
          accept="image/*"
        />
        <Button type="submit" primary>
          Register
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



export default Register;
