import React from "react";
import { shallow } from "enzyme";

import ChatMessage from "../../../components/Chat/ChatMessage";

describe("<ChatMessage />", () => {
  it("Render own message", () => {
    const wrapper = shallow(
      <ChatMessage message={{ user: "1" }} userId="1" userImages={{ 1: "1" }} />
    );

    expect(wrapper.find(".chat-message-own")).toHaveLength(1);
  });

  it("Render not own message", () => {
    const wrapper = shallow(
      <ChatMessage message={{ user: "2" }} userId="1" userImages={{ 2: "2" }} />
    );

    expect(wrapper.find(".chat-message")).toHaveLength(1);
  });
});
