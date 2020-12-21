import React, { useContext, useState } from "react";
import { Sidebar, Grid, Menu, Segment } from "semantic-ui-react";
import { DimensionContext } from "../../context/dimension";
import MenuBar from "./MenuBar";
import MenuItems from "./MenuItems";

const Layout = (props) => {
  const { width } = useContext(DimensionContext);

  const { children } = props;

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebarMenu = () => {
    setShowSidebar((p) => !p);
  };

  const showMenuRule = showSidebar && width <= 767;

  return (
    <Grid columns={1} style={{ margin: "0", minHeight: "100vh" }}>
      <Grid.Column style={{ padding: "0" }}>
        <Sidebar.Pushable
          as={Segment}
          style={{ transform: "none", backgroundColor: "#f2f2f2" }}
        >
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            onHide={() => {
              showSidebar && toggleSidebarMenu();
            }}
            vertical
            visible={showMenuRule}
            style={{ position: "fixed", maxWidth: "80vw" }}
          >
            <MenuItems toggleMenu={toggleSidebarMenu} width={width} />
          </Sidebar>
          <Sidebar.Pusher dimmed={showMenuRule}>
            <Segment basic style={{ padding: "0" }}>
              <MenuBar toggleMenu={toggleSidebarMenu} width={width} />
              {children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
  );
};

export default Layout;
