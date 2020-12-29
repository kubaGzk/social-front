import React, { useContext, useState } from "react";
import { Sidebar, Grid, Menu, Segment } from "semantic-ui-react";
import { DimensionContext } from "../../context/dimension";
import Invites from "../Invites/Invites";
import MenuBar from "./MenuBar";
import MenuItems from "./MenuItems";

const Layout = (props) => {
  const { children } = props;

  const { width } = useContext(DimensionContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showInvites, setShowInvites] = useState(false);

  const toggleSidebarMenu = () => {
    setShowSidebar((p) => !p);
  };

  const showMenuRule = showSidebar && width <= 767;

  return (
    <>
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
              <MenuItems
                toggleMenu={toggleSidebarMenu}
                width={width}
                toggleInvites={() => setShowInvites(true)}
              />
            </Sidebar>
            <Sidebar.Pusher dimmed={showMenuRule}>
              <Segment basic style={{ padding: "0" }}>
                <MenuBar
                  toggleMenu={toggleSidebarMenu}
                  width={width}
                  toggleInvites={() => setShowInvites(true)}
                />
                {children}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid.Column>
      </Grid>
      {showInvites && (
        <Invites showInvites={showInvites} setShowInvites={setShowInvites} />
      )}
    </>
  );
};

export default Layout;
