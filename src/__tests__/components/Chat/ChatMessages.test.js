import React from "react";
import { shallow } from "enzyme";
import ChatMessages from "../../../components/Chat/ChatMessages";
import ChatMessage from "../../../components/Chat/ChatMessage";

describe("<ChatMessages />", () => {
  //userId, messages, users, writing

  it("Render ChatMessages", () => {
    const wrapper = shallow(
      <ChatMessages
        userId="u1"
        messages={[{ id: "m1" }, { id: "m1" }, { id: "m1" }]}
        users={[
          { id: "u1", image: "u1", firstname: "u1" },
          { id: "u2", image: "u2", firstname: "u2" },
        ]}
        writing={["u2"]}
      />
    );

    expect(wrapper.find("#chat-messages")).toHaveLength(1);
    expect(wrapper.find(ChatMessage)).toHaveLength(3);
    expect(wrapper.text()).toEqual(
      "<ChatMessage /><ChatMessage /><ChatMessage />u2 is writing..."
    );
    expect(wrapper.text()).not.toEqual("No messages to display");
  });

  it("Render user is writing", () => {
    const wrapper = shallow(
      <ChatMessages
        userId="u1"
        messages={[{ id: "m1" }, { id: "m1" }, { id: "m1" }]}
        users={[
          { id: "u1", image: "u1", firstname: "u1" },
          { id: "u2", image: "u2", firstname: "u2" },
        ]}
        writing={["u2"]}
      />
    );

    expect(wrapper.text()).toEqual(
      "<ChatMessage /><ChatMessage /><ChatMessage />u2 is writing..."
    );
  });

  it("Not render user is writing", () => {
    const wrapper = shallow(
      <ChatMessages
        userId="u1"
        messages={[{ id: "m1" }, { id: "m1" }, { id: "m1" }]}
        users={[
          { id: "u1", image: "u1", firstname: "u1" },
          { id: "u2", image: "u2", firstname: "u2" },
        ]}
        writing={["u1"]}
      />
    );

    expect(wrapper.text()).toEqual(
      "<ChatMessage /><ChatMessage /><ChatMessage />"
    );
  });

  it("Render text (No messages to display)", () => {
    const wrapper = shallow(
      <ChatMessages
        userId="u1"
        messages={[]}
        users={[
          { id: "u1", image: "u1", firstname: "u1" },
          { id: "u2", image: "u2", firstname: "u2" },
        ]}
        writing={["u1"]}
      />
    );
    expect(wrapper.find(ChatMessage)).toHaveLength(0);
    expect(wrapper.find("#chat-messages")).toHaveLength(0);
    expect(wrapper.text()).toEqual("No messages to display");
  });
});
