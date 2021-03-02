import React from "react";
import { mount } from "enzyme";

import { MessageContext } from "../../../context/message";
import { DimensionContext } from "../../../context/dimension";

import MessageBox from "../../../components/Message/MessageBox";
import Messages from "../../../components/Message/Messages";

describe("<Messages />", () => {
  it("Renders two messages", () => {
    const wrapper = mount(
      <MessageContext.Provider
        value={{
          messages: [
            {
              id: "m1",
              header: "H1",
              text: "T1",
              type: "info",
              cb: () => {},
            },
            {
              id: "m2",
              header: "H2",
              text: "T2",
              type: "info",
              cb: () => {},
            },
          ],
          removeMessage: () => {},
        }}
      >
        <DimensionContext.Provider value={{ width: 800 }}>
          <Messages />
        </DimensionContext.Provider>
      </MessageContext.Provider>
    );

    expect(wrapper.find(MessageBox)).toHaveLength(2);
  });

  it("Renders no messages", () => {
    const wrapper = mount(
      <MessageContext.Provider
        value={{
          messages: [],
          removeMessage: () => {},
        }}
      >
        <DimensionContext.Provider value={{ width: 800 }}>
          <Messages />
        </DimensionContext.Provider>
      </MessageContext.Provider>
    );

    expect(wrapper.find(MessageBox)).toHaveLength(0);
  });
});
