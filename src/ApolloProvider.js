import React from "react";
import App from "./App";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/react-hooks";
import { AuthContextProvider } from "./context/auth";
import { createUploadLink } from "apollo-upload-client";
import { DimensionContextProvider } from "./context/dimension";

const httpLink = createUploadLink({
  uri: "http://localhost:5000/",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: ["userId"],
            merge(existing = [], incoming, { readField }) {
              if (incoming.length === 1) {
                const inDate = new Date(readField("createdAt", incoming[0]));
                const exDate = new Date(readField("createdAt", existing[0]));

                if (inDate > exDate) return [...incoming, ...existing];
              }
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <DimensionContextProvider>
        <App />
      </DimensionContextProvider>
    </AuthContextProvider>
  </ApolloProvider>
);
