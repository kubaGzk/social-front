import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { DimensionContext } from "../../context/dimension";

import MenuItems from "./MenuItems";
import { Menu, Icon, Button } from "semantic-ui-react";

const MenuBar = (props) => {
  const { width } = useContext(DimensionContext);

  const { toggleMenu, toggleInvites } = props;

  return (
    <Menu
      fluid
      size="massive"
      color="teal"
      style={{ position: "fixed", top: "0", zIndex: "100" }}
    >
      <Menu.Item name="home" as={Link} to="/">
        Social <Icon name="unhide" style={{ paddingLeft: "5px" }} />
      </Menu.Item>
      <Menu.Menu vertical="true" position="right">
        {width > 767 ? (
          <MenuItems toggleInvites={toggleInvites} />
        ) : (
          <Menu.Item>
            <Button icon="sidebar" onClick={toggleMenu} />
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;
