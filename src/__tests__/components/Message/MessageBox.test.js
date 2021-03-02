import React from "react";
import { mount } from "enzyme";

import { Message } from "semantic-ui-react";
import MessageBox from "../../../components/Message/MessageBox";

describe("<Message Box />", () => {
  let wrapper;

  const callback = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <MessageBox header="H" text="T" cb={callback} width={800} />
    );
  });

  it("Renders all provided elements", () => {
    expect(wrapper.text()).toEqual("HT");
  });

  it("Simulate callback click", () => {
    wrapper.find(Message.Content).simulate("click");
    expect(callback).toBeCalled();
  });
});
