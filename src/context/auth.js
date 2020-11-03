import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { createContext, useCallback, useReducer } from "react";

const INITIAL_STATE = {
  token: null,
  username: null,
  image: null,
  firstname: null,
  lastname: null,
  userId: null,
  email: null,
  error: null,
  loading: true,
};

const AuthContext = createContext({
  ...INITIAL_STATE,
  login: () => {},
  logout: () => {},
  checkLocal: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.token,
        username: action.username,
        image: action.image,
        firstname: action.firstname,
        lastname: action.lastname,
        userId: action.userId,
        email: action.email,
        error: null,
      };

    case "LOGOUT":
      return { ...INITIAL_STATE };

    case "ERROR":
      return { ...INITIAL_STATE, error: action.error };

    default:
      return state;
  }
};

const AuthContextProvider = (props) => {
  const [
    { token, username, firstname, lastname, image, userId, email, error },
    dispatch,
  ] = useReducer(authReducer, INITIAL_STATE);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");

    dispatch({ type: "LOGOUT" });
  };

  const login = (
    funToken,
    funUsername,
    funFirst,
    funLast,
    funImage,
    funUserId,
    funEmail,
    expiresIn
  ) => {
    let expirationTime = expiresIn;

    if (!expiresIn) {
      localStorage.setItem("token", funToken);
      localStorage.setItem("expiresIn", new Date().getTime() + 3600 * 1000);
      expirationTime = 3600 * 1000;
    }

    dispatch({
      type: "LOGIN",
      token: funToken,
      username: funUsername,
      firstname: funFirst,
      lastname: funLast,
      image: funImage,
      userId: funUserId,
      email: funEmail,
    });
    setTimeout(() => {
      logout();
    }, expirationTime);
  };

  const [validateToken, { loading }] = useMutation(VALIDATE_TOKEN, {
    update(_, result) {
      const {
        data: {
          validateToken: {
            username: localUsername,
            id: localId,
            email: localEmail,
            firstname: localFirstname,
            lastname: localLastname,
            image: localImage,
          },
        },
      } = result;

      const localToken = localStorage.getItem("token");
      const localExpiresIn =
        localStorage.getItem("expiresIn") - new Date().getTime();

      console.log(
        localToken,
        localUsername,
        localFirstname,
        localLastname,
        localImage,
        localId,
        localEmail,
        localExpiresIn
      );
      login(
        localToken,
        localUsername,
        localFirstname,
        localLastname,
        localImage,
        localId,
        localEmail,
        localExpiresIn
      );
    },
    onError(err) {
      console.log(err.graphQLErrors);
      logout();
    },
  });

  const checkLocal = useCallback(() => {
    const localToken = localStorage.getItem("token");
    const localExpiresIn =
      localStorage.getItem("expiresIn") - new Date().getTime();

    if (!token && localToken && localExpiresIn) {
      console.log();
      validateToken();
    }
  }, [validateToken]);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        image,
        firstname,
        lastname,
        userId,
        email,
        loading,
        login: (...args) => login(...args),
        logout: () => logout(),
        checkLocal: () => checkLocal(),
      }}
      {...props}
    />
  );
};

const VALIDATE_TOKEN = gql`
  mutation validate {
    validateToken {
      id
      email
      username
      lastname
      firstname
      image
    }
  }
`;

export { AuthContext, AuthContextProvider };
