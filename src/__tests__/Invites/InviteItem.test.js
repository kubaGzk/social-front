import React from "react";
import { shallow } from "enzyme";

import { Button, List } from "semantic-ui-react";
import InviteItem from "../../components/Invites/InviteItem";

describe("<InviteItem />", () => {
  const closeModal = jest.fn();
  const confirmInvite = jest.fn();
  const declineInvite = jest.fn();

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <InviteItem
        received={true}
        invite={{ id: "i1", image: "image", firstname: "u1", lastname: "u1" }}
        closeModal={closeModal}
        confirmInvite={confirmInvite}
        declineInvite={declineInvite}
      />
    );
  });

  it("Render received invite", () => {
    expect(wrapper.find({ positive: true }).find(Button)).toHaveLength(1);
    expect(wrapper.find({ negative: true }).find(Button)).toHaveLength(1);
  });

  it("Render sent invite", () => {
    wrapper = shallow(
      <InviteItem
        received={false}
        invite={{ id: "i1", image: "image", firstname: "u1", lastname: "u1" }}
        closeModal={closeModal}
        confirmInvite={confirmInvite}
        declineInvite={declineInvite}
      />
    );

    expect(wrapper.find({ positive: true }).find(Button)).toHaveLength(0);
    expect(wrapper.find({ negative: true }).find(Button)).toHaveLength(0);
  });

  it("Simulate confirm invite button click", () => {
    wrapper.find({ positive: true }).find(Button).simulate("click");
    expect(confirmInvite).toBeCalled();
  });

  it("Simulate confirm invite button click", () => {
    wrapper.find({ negative: true }).find(Button).simulate("click");
    expect(declineInvite).toBeCalled();
  });

  it("Simulate click on users name - received invites", () => {
    wrapper.find(List.Header).simulate("click");
    expect(closeModal).toBeCalled();
  });

  it("Simulate click on users name - sent invites", () => {
    wrapper = shallow(
      <InviteItem
        received={false}
        invite={{ id: "i1", image: "image", firstname: "u1", lastname: "u1" }}
        closeModal={closeModal}
        confirmInvite={confirmInvite}
        declineInvite={declineInvite}
      />
    );

    wrapper.find(List.Header).simulate("click");
    expect(closeModal).toBeCalled();
  });
});
