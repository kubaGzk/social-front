import React from "react";
import { shallow } from "enzyme";

import { Button, Dropdown, Item, Label, Menu } from "semantic-ui-react";
import MenuItems from "../../components/Menu/MenuItems";
import UserSearch from "../../components/UserSearch/UserSearch";

describe("<MenuItems />", () => {
  const toggleMenu = jest.fn();
  const toggleInvites = jest.fn();
  const logout = jest.fn();

  it("Renders not logged and small screen items", () => {
    const wrapper = shallow(<MenuItems width={767} token={null} />);

    expect(wrapper.find(Menu.Item)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it("Renders not logged and wide screen items", () => {
    const wrapper = shallow(<MenuItems width={768} token={null} />);

    expect(wrapper.find(Menu.Item)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it("Renders logged and small screen items", () => {
    const wrapper = shallow(<MenuItems width={767} token={"token"} />);

    expect(wrapper.find(Menu.Item)).toHaveLength(8);
    expect(wrapper.find(Label)).toHaveLength(1);
    expect(wrapper.find(UserSearch)).toHaveLength(1);
  });

  it("Renders logged and wide screen items", () => {
    const wrapper = shallow(<MenuItems width={768} token={"token"} />);

    expect(wrapper.find(Menu.Item)).toHaveLength(3);
    expect(wrapper.find(Dropdown)).toHaveLength(1);
    expect(wrapper.find(Label)).toHaveLength(1);
    expect(wrapper.find(UserSearch)).toHaveLength(1);
  });

  it("Simulate invites click and logout on small device", () => {
    const wrapper = shallow(
      <MenuItems
        width={767}
        token={"token"}
        toggleMenu={toggleMenu}
        toggleInvites={toggleInvites}
        logout={logout}
      />
    );

    wrapper.find({ name: "invites" }).find(Menu.Item).simulate("click");
    wrapper.find({ name: "logout" }).find(Menu.Item).simulate("click");

    expect(toggleMenu).toBeCalled();
    expect(toggleInvites).toBeCalled();
    expect(logout).toBeCalled();
  });

  it("Simulate invites click and logout click on wide device", () => {
    const wrapper = shallow(
      <MenuItems
        width={768}
        token={"token"}
        toggleMenu={toggleMenu}
        toggleInvites={toggleInvites}
        logout={logout}
      />
    );
    
    wrapper.find({ text: "Invites" }).find(Dropdown.Item).simulate("click");
    wrapper.find({ text: "Logout" }).find(Dropdown.Item).simulate("click");

    expect(toggleInvites).toBeCalled();
    expect(logout).toBeCalled();
  });

  it("Simulate register click", () => {
    const wrapper = shallow(
      <MenuItems width={767} token={null} toggleMenu={toggleMenu} />
    );

    wrapper.find(Button).simulate("click");

    expect(toggleMenu).toBeCalled();
  });
});
