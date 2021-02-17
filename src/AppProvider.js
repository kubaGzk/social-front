import React from "react";

import { ApolloProvider } from "@apollo/client";

import { AuthContextProvider } from "./context/auth";
import { DimensionContextProvider } from "./context/dimension";
import { MessageContextProvider } from "./context/message";
import createApolloClient from "./util/apollo-client";

import App from "./App";

const AppProvider = () => {
  const { client, wsLink } = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <AuthContextProvider wsLink={wsLink}>
        <DimensionContextProvider>
          <MessageContextProvider>
            <App />
          </MessageContextProvider>
        </DimensionContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
};

export default AppProvider;
