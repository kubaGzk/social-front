import React from "react";
import { shallow } from "enzyme";
import ChatMessages from "../ChatMessages";

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
        writing={["u1"]}
      />
    );

    expect(wrapper.find("#chat-messages")).toHaveLength(1);
  });
});
