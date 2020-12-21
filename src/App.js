import React, { useContext, useEffect, useState, useCallback } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Home from "./pages/Home";
import { Container, Dimmer, Loader } from "semantic-ui-react";
import { AuthContext } from "./context/auth";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Menu/Layout";
import User from "./pages/User";

function App() {
  const { token, checkLocal, loading } = useContext(AuthContext);

  useEffect(() => {
    checkLocal();
  }, []);

  let routes = (
    <>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/user/:id" component={User} />
      <Route exact path="/" component={Home} />
    </>
  );

  if (token) {
    routes = (
      <>
        <Route exact path="/user/:id" component={User} />
        <Route exact path="/" component={Home} />
      </>
    );
  }

  return (
    <div className="App" id="App">
      <Router>
        <Layout>
          <Container className="body-container">
            <Switch>
              {routes}
              <Redirect to="/" />
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
