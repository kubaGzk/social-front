import React, { useContext, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Home from "./pages/Home";
import MenuBar from "./components/Menu/MenuBar";
import { Container, Dimmer, Loader } from "semantic-ui-react";
import { AuthContext } from "./context/auth";
import LoginPage from "./pages/LoginPage";

function App() {
  const { token, checkLocal, loading } = useContext(AuthContext);

  useEffect(() => {
    checkLocal();
  }, []);

  let routes = (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={LoginPage} />
    </>
  );

  if (token) {
    routes = <Route exact path="/" component={Home} />;
  }

  return (
    <div className="App">
      <Router>
        <Container className="body-container">
          <MenuBar />
          <Switch>
            {routes}
            <Redirect to="/" />
          </Switch>
        </Container>
      </Router>

      <Dimmer active={loading}>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    </div>
  );
}

export default App;
