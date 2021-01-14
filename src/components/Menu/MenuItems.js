import { useLazyQuery } from "@apollo/client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Icon,
  Input,
  Label,
  Menu,
  Dropdown,
  Search,
} from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { DimensionContext } from "../../context/dimension";
import { FETCH_USER_LIST } from "../../util/graphql";

const MenuItems = (props) => {
  const { toggleMenu, toggleInvites } = props;

  const { token, logout, firstname, lastname, image, userId } = useContext(
    AuthContext
  );
  const { width } = useContext(DimensionContext);

  const timeoutRef = useRef();
  const searchValRef = useRef();
  const [searchVal, setSearchVal] = useState("");
  const [results, setResults] = useState([]);

  searchValRef.current = searchVal;

  const [fetchUserList, { loading }] = useLazyQuery(FETCH_USER_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setResults(() => {
        if (data.getUserList.length < 1) {
          return [{ title: "No results" }];
        }

        return data.getUserList.map((el) => {
          return {
            title: `${el.firstname} ${el.lastname}`,
            image: process.env.REACT_APP_IMAGES_URL + "/" + el.image,
            id: el.id,
          };
        });
      });
    },
  });

  const handleSearchChange = useCallback((e, data) => {
    setSearchVal(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      searchValRef.current.length > 0 &&
        fetchUserList({ variables: { text: searchValRef.current } });
    }, 500);
  }, []);

  const history = useHistory();

  const search = (
    <Search
      loading={loading}
      onResultSelect={(e, data) => {
        toggleMenu && toggleMenu();
        data.result.id && history.push(`/user/${data.result.id}`);
      }}
      placeholder={"Search for friend..."}
      onSearchChange={handleSearchChange}
      results={results}
      size="mini"
      value={searchVal}
      className="user-search"
      showNoResults={false}
    />
  );

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
        <Menu.Item style={{ maxWidth: "80%" }}>{search}</Menu.Item>
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
            />
            <span style={{ paddingLeft: "1rem" }}>
              {firstname + " " + lastname}
            </span>
          </Label>
        </Menu.Item>
        <Menu.Item />
        <Menu.Item style={{ width: "100%" }}>{search}</Menu.Item>
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
