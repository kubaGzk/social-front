import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { AuthContext } from "../../../context/auth";
import { DimensionContext } from "../../../context/dimension";
import UserCard from "../../../components/Post/UserCard";
import {
  CONFIRM_INVITE,
  CREATE_INVITE,
  DECLINE_INVITE,
} from "../../../util/graphql";
import { Button, Icon } from "semantic-ui-react";
import EditProfile from "../../../forms/EditProfile";
import { MessageContext } from "../../../context/message";
import { act } from "@testing-library/react";

const mocks = [
  {
    request: { query: CREATE_INVITE, variables: { receiver: "u2" } },
    result: {
      data: { createInvite: { message: "M" } },
    },
  },

  {
    request: { query: DECLINE_INVITE, variables: { requestor: "u2" } },
    result: {
      data: { declineInvite: { message: "M" } },
    },
  },
  {
    request: { query: CONFIRM_INVITE, variables: { requestor: "u2" } },
    result: {
      data: { confirmInvite: { message: "M" } },
    },
  },
];

describe("<UserCard />", () => {
  let wrapper;

  const addMessage = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={{ token: "tkn", userId: "u1" }}>
          <DimensionContext.Provider value={{ width: 800 }}>
            <MessageContext.Provider value={{ addMessage: addMessage }}>
              <UserCard
                user={{
                  firstname: "u1",
                  lastname: "u1",
                  image: "image",
                  createdAt: new Date(),
                  friends: ["u2", "u3"],
                  invitesReceived: ["u4"],
                  invitesSend: ["u5"],
                  postsCount: 5,
                  description: "My name...",
                  id: "u1",
                }}
                loading={false}
                refetchUser={() => {}}
                refetchPosts={() => {}}
              />
            </MessageContext.Provider>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it("Renders edit button when auth", () => {
    expect(wrapper.find({ name: "edit outline" }).find(Icon)).toHaveLength(1);
  });

  it("Turn on edit mode when auth", () => {
    wrapper.find({ name: "edit outline" }).find(Icon).simulate("click");
    expect(wrapper.find(EditProfile)).toHaveLength(1);
  });

  it("Renders no buttons when not auth", () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={{ token: null, userId: null }}>
          <DimensionContext.Provider value={{ width: 800 }}>
            <MessageContext.Provider value={{ addMessage: addMessage }}>
              <UserCard
                user={{
                  firstname: "u1",
                  lastname: "u1",
                  image: "image",
                  createdAt: new Date(),
                  friends: ["u2", "u3"],
                  invitesReceived: ["u4"],
                  invitesSend: ["u5"],
                  postsCount: 5,
                  description: "My name...",
                  id: "u1",
                }}
                loading={false}
                refetchUser={() => {}}
                refetchPosts={() => {}}
              />
            </MessageContext.Provider>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it("Should send invite", async () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider value={{ token: "tkn", userId: "u1" }}>
          <DimensionContext.Provider value={{ width: 800 }}>
            <MessageContext.Provider value={{ addMessage: addMessage }}>
              <UserCard
                user={{
                  firstname: "u2",
                  lastname: "u2",
                  image: "image",
                  createdAt: new Date(),
                  friends: ["u3"],
                  invitesReceived: [],
                  invitesSend: [],
                  postsCount: 5,
                  description: "My name...",
                  id: "u2",
                }}
                loading={false}
                refetchUser={() => {}}
                refetchPosts={() => {}}
              />
            </MessageContext.Provider>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
    wrapper.find({ name: "address book outline" }).find(Icon).simulate("click");
    await act(async () => {
      await new Promise((res) => setTimeout(res, 2000));
      wrapper.update();
    });
    expect(addMessage).toBeCalled();
  });

  describe("Auth, able to confirm and decline", () => {
    beforeEach(() => {
      wrapper = mount(
        <MockedProvider mocks={mocks}>
          <AuthContext.Provider value={{ token: "tkn", userId: "u1" }}>
            <DimensionContext.Provider value={{ width: 800 }}>
              <MessageContext.Provider value={{ addMessage: addMessage }}>
                <UserCard
                  user={{
                    firstname: "u2",
                    lastname: "u2",
                    image: "image",
                    createdAt: new Date(),
                    friends: ["u3"],
                    invitesReceived: [],
                    invitesSend: ["u1"],
                    postsCount: 5,
                    description: "My name...",
                    id: "u2",
                  }}
                  loading={false}
                  refetchUser={() => {}}
                  refetchPosts={() => {}}
                />
              </MessageContext.Provider>
            </DimensionContext.Provider>
          </AuthContext.Provider>
        </MockedProvider>
      );
    });

    it("Renders received invite buttons", () => {
      expect(wrapper.find({ positive: true }).find(Button)).toHaveLength(1);
      expect(wrapper.find({ negative: true }).find(Button)).toHaveLength(1);
    });

    it("Confirm invite", async () => {
      wrapper.find({ positive: true }).find(Button).simulate("click");
      await act(async () => {
        await new Promise((res) => setTimeout(res, 2000));
        wrapper.update();
      });
      expect(addMessage).toBeCalled();
    });

    it("Decline invite", async () => {
      wrapper.find({ negative: true }).find(Button).simulate("click");
      await act(async () => {
        await new Promise((res) => setTimeout(res, 2000));
        wrapper.update();
      });
      expect(addMessage).toBeCalled();
    });
  });
});
