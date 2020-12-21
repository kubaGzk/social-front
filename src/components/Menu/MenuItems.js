import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Input, Label, Menu, Dropdown } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { DimensionContext } from "../../context/dimension";

const MenuItems = (props) => {
  const { token, logout, firstname, lastname, image, userId } = useContext(
    AuthContext
  );
  const { width } = useContext(DimensionContext);

  const { toggleMenu } = props;

  let menuItems = (
    <>
      {width <= 767}
      <Menu.Item name="login">
        <Button
          as={Link}
          color="teal"
          to="/login"
          onClick={() => {
            toggleMenu && toggleMenu();
          }}
        >
          Register/Login
        </Button>
      </Menu.Item>
    </>
  );

  if (token && width > 767) {
    menuItems = (
      <>
        <Menu.Item style={{ maxWidth: "80%" }}>
          <Input
            action={{ type: "submit", content: <Icon name="search" /> }}
            placeholder="Search for friend..."
          />
        </Menu.Item>
        <Menu.Item style={{ maxWidth: "13rem" }}>
          <Label
            as={Link}
            style={{
              marginLeft: "0",
              display: "flex",
              justifyContent: "space-beetwen",
              alignItems: "center",
            }}
            onClick={toggleMenu}
            to={`/user/${userId}`}
          >
            <img
              src={process.env.REACT_APP_IMAGES_URL + "/" + image}
              style={{ borderRadius: "inherit" }}
            />
            <span style={{ paddingLeft: "1rem" }}>
              {firstname + " " + lastname}
            </span>
          </Label>
        </Menu.Item>
        <Menu.Item style={{ padding: "0" }}>
          <Dropdown
            icon="ellipsis vertical"
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "4rem",
            }}
          >
            <Dropdown.Menu>
              <Dropdown.Item text="Open..." description="ctrl + o" />
              <Dropdown.Divider />
              <Dropdown.Item text="Logout" onClick={logout} as={Link} to="/" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </>
    );
  } else if (token) {
    menuItems = (
      <>
        <Menu.Item />
        <Menu.Item style={{ display: "flex" }}>
          <Label onClick={toggleMenu} as={Link} to={`/user/${userId}`}>
            <img
              src={process.env.REACT_APP_IMAGES_URL + "/" + image}
              style={{ borderRadius: "inherit" }}
            />
            <span style={{ paddingLeft: "1rem" }}>
              {firstname + " " + lastname}
            </span>
          </Label>
        </Menu.Item>
        <Menu.Item />
        <Menu.Item style={{ width: "100%" }}>
          <Input
            action={{ type: "submit", content: <Icon name="search" /> }}
            placeholder="Search for friend..."
            size="mini"
          />
        </Menu.Item>
        <Menu.Item />
        <Menu.Item
          name="logout"
          onClick={() => {
            logout();
            toggleMenu();
          }}
          as={Link}
          to="/"
        />
      </>
    );
  }
  return menuItems;
};

export default MenuItems;
