import React from "react";
import { Link } from "react-router-dom";

import { Button, Label, Menu, Dropdown } from "semantic-ui-react";
import UserSearch from "../UserSearch/UserSearch";

const MenuItems = (props) => {
  const {
    toggleMenu,
    toggleInvites,
    token,
    logout,
    firstname,
    lastname,
    image,
    userId,
    width,
    history,
  } = props;

  const resultSelect = (e, data) => {
    toggleMenu && toggleMenu();
    data.result.id && history.push(`/user/${data.result.id}`);
  };

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
          <UserSearch
            placeholder="Search for friend..."
            resultSelect={resultSelect}
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
            to={`/user/${userId}`}
          >
            <img
              src={process.env.REACT_APP_IMAGES_URL + "/" + image}
              style={{ borderRadius: "inherit" }}
              alt="Avatar"
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
              <Dropdown.Item
                text="Invites"
                icon="group"
                onClick={toggleInvites}
              />
              <Dropdown.Divider />
              <Dropdown.Item
                text="Logout"
                onClick={logout}
                as={Link}
                to="/"
                icon="sign-out"
              />
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
              alt="Avatar"
            />
            <span style={{ paddingLeft: "1rem" }}>
              {firstname + " " + lastname}
            </span>
          </Label>
        </Menu.Item>
        <Menu.Item />
        <Menu.Item style={{ width: "100%" }}>
          <UserSearch
            placeholder="Search for friend..."
            resultSelect={resultSelect}
          />
        </Menu.Item>
        <Menu.Item />
        <Menu.Item
          name="invites"
          onClick={() => {
            toggleMenu();
            toggleInvites();
          }}
        />
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
