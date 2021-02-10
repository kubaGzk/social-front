import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import { AuthContext } from "./context/auth";

import "./App.css";
import "semantic-ui-css/semantic.min.css";

import { Container, Dimmer, Loader } from "semantic-ui-react";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Menu/Layout";
import User from "./pages/User";

function App() {
  const { token, checkLocal, loading } = useContext(AuthContext);

  useEffect(() => {
    checkLocal();
  }, []);

  return (
    <div className="App" id="App">
      <Router>
        <Layout>
          <Container className="body-container">
            <Switch>
              {!token && <Route exact path="/login" component={LoginPage} />}
              <Route exact path="/user/:id" component={User} />
              <Route exact path="/" component={Home} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Container>
        </Layout>
        <Dimmer active={loading} style={{ minHeight: "100vh" }}>
          <Loader size="huge">Loading</Loader>
        </Dimmer>
      </Router>
    </div>
  );
}

export default App;
