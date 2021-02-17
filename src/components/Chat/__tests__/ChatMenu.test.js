import React from "react";
import { shallow, mount } from "enzyme";

import ChatMenu from "../ChatMenu";
import { Button, Feed } from "semantic-ui-react";
import ChatWindow from "../ChatWindow";
import ChatCreateGroup from "../ChatCreateGroup";

describe("<Chat Menu />", () => {
  it("Render no chat", () => {
    const wrapper = shallow(<ChatMenu showChat={false} openChat={false} openCreateGroup={false} />);
    expect(wrapper.find(".zero-height")).toHaveLength(1);
    expect(wrapper.find(".display-none")).toHaveLength(1);
    expect(wrapper.find(ChatWindow)).toHaveLength(0);
    expect(wrapper.find(ChatCreateGroup)).toHaveLength(0);
  });
  it("Render chat and chat elements", () => {
    const wrapper = shallow(
      <ChatMenu showChat={true} openChat={true} openCreateGroup={true} />
    );
    expect(wrapper.find(".zero-height")).toHaveLength(0);
    expect(wrapper.find(".display-none")).toHaveLength(0);
    expect(wrapper.find(ChatWindow)).toHaveLength(1);
    expect(wrapper.find(ChatCreateGroup)).toHaveLength(1);
  });

  it("Simulate clicks", () => {
    const setOpenCreateGroup = jest.fn();
    const setShowChat = jest.fn();

    const wrapper = shallow(
      <ChatMenu
        setOpenCreateGroup={setOpenCreateGroup}
        setShowChat={setShowChat}
      />
    );

    expect(wrapper.find(Button)).toHaveLength(1);

    wrapper.find(Button).simulate("click");
    expect(setOpenCreateGroup).toBeCalled();
    expect(setShowChat).toBeCalled();
  });

  it("Render no chat elements - Feed", () => {
    const wrapper = shallow(<ChatMenu chats={false} />);
    expect(wrapper.find(Feed)).toHaveLength(0);
  });

  it("Render chat elements - Feed", () => {
    const wrapper = shallow(<ChatMenu chats={[{ id: "1" }, { id: "2" }]} />);
    expect(wrapper.find(Feed)).toHaveLength(1);
  });
});
