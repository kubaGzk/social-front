import React from "react";
import { shallow } from "enzyme";

import { List } from "semantic-ui-react";
import InviteItems from "../../../components/Invites/InviteItems";
import InviteItem from "../../../components/Invites/InviteItem";

describe("<InviteItems />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<InviteItems invites={["i1", "i2"]} />);
  });

  it("Renders two Invite Item's", () => {
    expect(wrapper.find(InviteItem)).toHaveLength(2);
  });

  it("Renders no items", () => {
    wrapper = shallow(<InviteItems invites={[]} />);
    expect(wrapper.find(InviteItem)).toHaveLength(0);
    expect(wrapper.find(List.Item)).toHaveLength(1);
  });
});
