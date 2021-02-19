import React from "react";
import { shallow } from "enzyme";

import { Button } from "semantic-ui-react";
import MenuBar from "../../components/Menu/MenuBar";
import MenuItems from "../../components/Menu/MenuItems";

describe("<MenuBar />", () => {
  let wrapper;

  const toggleMenu = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<MenuBar toggleMenu={toggleMenu} width={700} />);
  });

  it("Renders Toggle Button", () => {
    expect(wrapper.find(MenuItems)).toHaveLength(0);
    expect(wrapper.find({ icon: "sidebar" }).find(Button)).toHaveLength(1);
  });

  it("Simulate click Toggle Button", () => {
    wrapper.find({ icon: "sidebar" }).find(Button).simulate("click");

    expect(toggleMenu).toBeCalled();
  });

  it("Renders MenuItems", () => {
    wrapper = shallow(<MenuBar toggleMenu={toggleMenu} width={800} />);
    expect(wrapper.find(MenuItems)).toHaveLength(1);
    expect(wrapper.find({ icon: "sidebar" }).find(Button)).toHaveLength(0);
  });
});
