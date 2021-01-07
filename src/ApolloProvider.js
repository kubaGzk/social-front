import React from "react";
import App from "./App";
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/react-hooks";
import { AuthContextProvider } from "./context/auth";
import { createUploadLink } from "apollo-upload-client";
import { DimensionContextProvider } from "./context/dimension";
import { MessageContextProvider } from "./context/message";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createUploadLink({
  uri: `http:${process.env.REACT_APP_SERVER}`,
});

const wsLink = new WebSocketLink({
  uri: `ws:${process.env.REACT_APP_SERVER}/graphql`,
  options: {
    reconnect: true,
  },
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: ["userId"],
            merge(existing = [], incoming, { readField }) {
              const returned = [...existing];

              for (let inc of incoming) {
                const inId = readField("id", inc);

                const index = returned.findIndex((post) => {
                  const postId = readField("id", post);
                  return inId === postId;
                });

                if (index !== -1) {
                  returned[index] = inc;
                } else {
                  returned.push(inc);
                }
              }

              return returned.sort((a, b) => {
                const inDate = new Date(readField("createdAt", a));
                const exDate = new Date(readField("createdAt", b));
                return exDate - inDate;
              });
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
        <MessageContextProvider>
          <App />
        </MessageContextProvider>
      </DimensionContextProvider>
    </AuthContextProvider>
  </ApolloProvider>
);
