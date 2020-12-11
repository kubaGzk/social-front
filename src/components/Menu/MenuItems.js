import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Input, Label, Menu } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { DimensionContext } from "../../context/dimension";

const MenuItems = (props) => {
  const { token, logout, firstname, lastname, image } = useContext(AuthContext);
    const {width} = useContext(DimensionContext)

  const { toggleMenu } = props;


  let menuItems = (
    <>
      {width <= 767 && <Menu.Item />}
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
        <Menu.Item name="logout" onClick={logout} as={Link} to="/" />
        <Menu.Item style={{ maxWidth: "13rem" }}>
          <Label
            as="a"
            style={{
              marginLeft: "0",
              display: "flex",
              justifyContent: "space-beetwen",
              alignItems: "center",
            }}
            onClick={toggleMenu}
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
      </>
    );
  } else if (token) {
    menuItems = (
      <>
        <Menu.Item />
        <Menu.Item style={{ display: "flex" }}>
          <Label as="a" onClick={toggleMenu}>
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
