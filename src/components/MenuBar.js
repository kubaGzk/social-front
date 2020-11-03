import React, {
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Label,
  Input,
  Icon,
  Button,
  Dropdown,
  Ref,
} from "semantic-ui-react";
import { AuthContext } from "../context/auth";

const MenuBar = (props) => {
  const { token, logout, firstname, lastname, image } = useContext(AuthContext);

  const [{ width }, setWidth] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();
  const dropdownMenuRef = useRef();

  const updateWindowSize = useCallback(() => {
    const innerWidth = window.innerWidth;
    const innerHeigth = window.innerHeight;

    setWidth({ width: innerWidth, height: innerHeigth });
  });

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    document.addEventListener("mousedown", outsideClickHandler);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [updateWindowSize]);

  const outsideClickHandler = (e) => {
    if (
      width <= 767 &&
      !dropdownRef.current.contains(e.target) &&
      !dropdownMenuRef.current.contains(e.target)
    ) {
      setDropdownOpen(false);
    }
  };

  const dropdownClickHandler = (e) => {
    if (!dropdownMenuRef.current.contains(e.target)) {
      setDropdownOpen((prev) => !prev);
    }
  };

  let menuItems = (
    <>
      <Menu.Item name="login">
        <Button as={Link} color="teal" to="/login">
          Register/Login
        </Button>
      </Menu.Item>
    </>
  );

  let dropdownItems = (
    <Ref innerRef={dropdownRef}>
      <Dropdown
        item
        icon="sidebar"
        open={dropdownOpen}
        onClick={dropdownClickHandler}
        className="sidebar-button"
      >
        <Ref innerRef={dropdownMenuRef}>
          <Dropdown.Menu>
            <Dropdown.Item name="login">
              <Button as={Link} color="teal" to="/login">
                Register/Login
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Ref>
      </Dropdown>
    </Ref>
  );

  if (token) {
    menuItems = (
      <>
        <Menu.Item>
          <Input
            action={{ type: "submit", content: "Go" }}
            placeholder="Navigate to..."
          />
        </Menu.Item>
        <Menu.Item name="logout" onClick={() => logout()} as={Link} to="/" />
        <Menu.Item style={{maxWidth: "13rem"}}>
          <Label
            as="a"
            style={{
              marginLeft: "0",
              display: "flex",
              justifyContent: "space-beetwen",
              alignItems: "center",
            }}
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

    dropdownItems = (
      <Ref innerRef={dropdownRef}>
        <Dropdown
          item
          icon="sidebar"
          open={dropdownOpen}
          onClick={dropdownClickHandler}
          className="sidebar-button"
        >
          <Ref innerRef={dropdownMenuRef}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Label
                  as="a"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={process.env.REACT_APP_IMAGES_URL + "/" + image}
                    style={{ borderRadius: "inherit" }}
                  />
                  <span style={{ paddingLeft: "1rem" }}>
                    {firstname + " " + lastname}
                  </span>
                </Label>
              </Dropdown.Item>
              <Dropdown.Item>
                <Input
                  action={{ type: "submit", content: "Go" }}
                  placeholder="Navigate to..."
                />
              </Dropdown.Item>
              <Dropdown.Item
                name="logout"
                onClick={() => logout()}
                as={Link}
                to="/"
                style={{ textAlign: "center" }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Ref>
        </Dropdown>
      </Ref>
    );
  }

  return (
    <div>
      <Menu fluid size="massive" color="teal">
        <Menu.Item name="home" as={Link} to="/">
          Social <Icon name="unhide" style={{ paddingLeft: "5px" }} />
        </Menu.Item>
        <Menu.Menu vertical="true" position="right">
          {width > 767 ? menuItems : dropdownItems}
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default MenuBar;
