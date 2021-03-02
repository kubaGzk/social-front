import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { MockedProvider } from "@apollo/client/testing";

import {
  FETCH_CHATS,
  ON_CHANGE_CHAT_LIST,
  ON_NEW_CHAT,
} from "../../../util/graphql";

import ChatMenu from "../../../components/Chat/ChatMenu";
import ChatContainer from "../../../components/Chat/ChatContainer";
import ChatMenuItem from "../../../components/Chat/ChatMenuItem";

const mocks = [
  {
    request: { query: FETCH_CHATS },
    result: {
      data: {
        getChats: [
          {
            id: "chat_1",
            unread: 0,
            users: [
              {
                firstname: "Test",
                lastname: "One",
                image: "test_one.jpg",
                id: "user_1",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Two",
                image: "test_two.jpg",
                id: "user_2",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Three",
                image: "test_three.jpg",
                id: "user_3",
                __typename: "User",
              },
            ],
            __typename: "Chat",
          },
          {
            id: "chat_2",
            unread: 0,
            users: [
              {
                firstname: "Test",
                lastname: "Two",
                image: "test_two.jpg",
                id: "user_2",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Three",
                image: "test_three.jpg",
                id: "user_3",
                __typename: "User",
              },
            ],
            __typename: "Chat",
          },
        ],
      },
    },
  },
  {
    request: { query: FETCH_CHATS },
    result: {
      data: {
        getChats: [
          {
            id: "chat_1",
            unread: 0,
            users: [
              {
                firstname: "Test",
                lastname: "One",
                image: "test_one.jpg",
                id: "user_1",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Two",
                image: "test_two.jpg",
                id: "user_2",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Three",
                image: "test_three.jpg",
                id: "user_3",
                __typename: "User",
              },
            ],
            __typename: "Chat",
          },
          {
            id: "chat_2",
            unread: 0,
            users: [
              {
                firstname: "Test",
                lastname: "Two",
                image: "test_two.jpg",
                id: "user_2",
                __typename: "User",
              },
              {
                firstname: "Test",
                lastname: "Three",
                image: "test_three.jpg",
                id: "user_3",
                __typename: "User",
              },
            ],
            __typename: "Chat",
          },
        ],
      },
    },
  },
  {
    request: { query: ON_CHANGE_CHAT_LIST },
    result: {
      data: {
        chatChange: {
          id: "chat_1",
          users: [
            {
              firstname: "Test",
              lastname: "One",
              image: "test_one.jpg",
              id: "user_1",
              __typename: "User",
            },
            {
              firstname: "Test",
              lastname: "Two",
              image: "test_two.jpg",
              id: "user_2",
              __typename: "User",
            },
            {
              firstname: "Test",
              lastname: "Three",
              image: "test_three.jpg",
              id: "user_3",
              __typename: "User",
            },
          ],
          __typename: "Chat",
        },
      },
    },
  },
  {
    request: { query: ON_NEW_CHAT },
    result: {
      data: {
        newChat: {
          id: "chat_3",
          users: [
            {
              firstname: "Test",
              lastname: "One",
              image: "test_one.jpg",
              id: "user_1",
              __typename: "User",
            },
            {
              firstname: "Test",
              lastname: "Two",
              image: "test_two.jpg",
              id: "user_2",
              __typename: "User",
            },
            {
              firstname: "Test",
              lastname: "Three",
              image: "test_three.jpg",
              id: "user_3",
              __typename: "User",
            },
          ],
          unread: 0,
          __typename: "Chat",
        },
      },
    },
  },
];

describe("<ChatContainer />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <ChatContainer />
      </MockedProvider>
    );
  });

  it("Render Button", () => {
    expect(wrapper.find("button.chat-button")).toHaveLength(1);
  });

  it("Render Chat Menu", () => {
    expect(wrapper.find(ChatMenu)).toHaveLength(1);
  });

  it("Closed Chat Menu on mount", () => {
    expect(wrapper.find("div.chat-menu.zero-height")).toHaveLength(1);
  });

  it("Simulate open Chat Menu on click", () => {
    wrapper.find("button.chat-button").simulate("click");
    expect(wrapper.find("div.chat-menu.zero-height")).toHaveLength(0);
    expect(wrapper.find("div.chat-menu")).toHaveLength(1);
  });

  it("Simulate close Chat Menu on second click", () => {
    wrapper.find("button.chat-button").simulate("click");
    wrapper.find("button.chat-button").simulate("click");
    expect(wrapper.find("div.chat-menu.zero-height")).toHaveLength(1);
  });

  it("Render no Chat Menu Items while loading Chats", () => {
    expect(wrapper.find(ChatMenuItem)).toHaveLength(0);
  });

  it("Render Chat Menu Items after loading Chats", async () => {
    await act(async () => {
      await new Promise((res) => setTimeout(res, 0));
      wrapper.update();
    });
    expect(wrapper.find(ChatMenuItem)).toHaveLength(3);
  });
});
