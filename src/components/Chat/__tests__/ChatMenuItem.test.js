import React from "react";
import { shallow } from "enzyme";

import { Feed } from "semantic-ui-react";
import ChatMenuItem from "../ChatMenuItem";

describe("<ChatMenuItem />", () => {
  let wrapper;
  const setOpenChat = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <ChatMenuItem
        setOpenChat={setOpenChat}
        chat={{
          users: [
            { firstname: "One", lastname: "One", id: "1", image: "" },
            { firstname: "Two", lastname: "Two", id: "2", image: "" },
          ],
          unread: 0,
        }}
        userId="1"
      />
    );
  });

  it("Simulate clicks to close chat", () => {
    wrapper.find(Feed.Content).simulate("click");
    expect(setOpenChat).toBeCalled();
  });
});
