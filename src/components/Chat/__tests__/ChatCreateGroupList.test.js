import React from "react";
import { shallow } from "enzyme";

import { List } from "semantic-ui-react";
import ChatCreateGroupList from "../ChatCreateGroupList";

describe("<ChatCreateGroupList />", () => {
  let wrapper;

  const removeUser = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <ChatCreateGroupList
        userId={"user_1"}
        users={[
          { id: "user_1", title: "User One", image: "image" },
          { id: "user_2", title: "User Two", image: "image" },
        ]}
        removeUser={removeUser}
      />
    );
  });

  it("Renders two users", () => {
    expect(wrapper.find(List.Item)).toHaveLength(2);
    expect(wrapper.find("span")).toHaveLength(1);
  });
  it("Renders four users +", () => {
    wrapper = shallow(
      <ChatCreateGroupList
        userId={"user_1"}
        users={[
          { id: "user_1", title: "User One", image: "image" },
          { id: "user_2", title: "User Two", image: "image" },
          { id: "user_3", title: "User Three", image: "image" },
          { id: "user_4", title: "User Four", image: "image" },
        ]}
        removeUser={removeUser}
      />
    );

    expect(wrapper.find(List.Item)).toHaveLength(4);
    expect(wrapper.find("span")).toHaveLength(3);
  });

  it("Simulate click", () => {
    wrapper.find(List.Description).simulate("click");
    expect(removeUser).toBeCalled();
  });
});
