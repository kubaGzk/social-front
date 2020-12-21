import { useMutation } from "@apollo/react-hooks";
import React, { createContext, useCallback, useReducer } from "react";
import jwtDecode from "jwt-decode";
import { VALIDATE_TOKEN } from "../util/graphql";
import { useApolloClient } from "@apollo/client";

const INITIAL_STATE = {
  token: null,
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

  const client = useApolloClient();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");

    client.resetStore();

    dispatch({ type: "LOGOUT" });
  };

  const login = (
    funToken,
    funFirst,
    funLast,
    funImage,
    funUserId,
    funEmail
  ) => {
    localStorage.setItem("token", funToken);
    const { exp } = jwtDecode(funToken);
    const expirationDate = exp * 1000 - Date.now();

    dispatch({
      type: "LOGIN",
      token: funToken,
      firstname: funFirst,
      lastname: funLast,
      image: funImage,
      userId: funUserId,
      email: funEmail,
    });
    setTimeout(() => {
      logout();
    }, expirationDate);
  };

  const [validateToken, { loading }] = useMutation(VALIDATE_TOKEN, {
    update(_, result) {
      const {
        data: {
          validateToken: {
            id: localId,
            email: localEmail,
            firstname: localFirstname,
            lastname: localLastname,
            image: localImage,
          },
        },
      } = result;

      const localToken = localStorage.getItem("token");

      login(
        localToken,
        localFirstname,
        localLastname,
        localImage,
        localId,
        localEmail
      );
    },
    onError(err) {
      console.log(err.graphQLErrors);
      logout();
    },
  });

  const checkLocal = useCallback(() => {
    const localToken = localStorage.getItem("token");

    if (!token && localToken) {
      const { exp } = jwtDecode(localToken);
      exp * 1000 - Date.now() > 0 ? validateToken() : logout();
    }
  }, [validateToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
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

export { AuthContext, AuthContextProvider };
