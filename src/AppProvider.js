import React, { createContext, useState } from "react";
import App from "./App";

import { ApolloProvider } from "@apollo/react-hooks";
import { AuthContextProvider } from "./context/auth";

import { DimensionContextProvider } from "./context/dimension";
import { MessageContextProvider } from "./context/message";
import createApolloClient from "./util/apollo-client";

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
