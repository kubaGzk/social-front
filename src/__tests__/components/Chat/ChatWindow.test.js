import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";

import {
  FETCH_CHAT,
  ON_CHANGE_CHAT,
  READ_MESSAGE,
  END_WRITING,
  START_WRITING,
  WRITE_MESSAGE,
} from "../../../util/graphql";

import { Card } from "semantic-ui-react";
import ChatMessages from "../../../components/Chat/ChatMessages";
import ChatWindow from "../../../components/Chat/ChatWindow";

const mocks = [
  {
    request: { query: FETCH_CHAT, variables: { chatId: "chat_1" } },
    result: {
      data: {
        getChat: {
          id: "chat_1",
          unread: 0,
          writing: [],
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
          messages: [
            {
              id: "m1",
              body: "text",
              user: "u1",
              createdAt: "01.01.2020",
              read: ["u1"],
            },
          ],
          __typename: "Chat",
        },
      },
    },
  },
  {
    request: { query: ON_CHANGE_CHAT },
    result: {
      data: {
        getChat: {
          id: "chat_1",

          __typename: "Chat",
        },
      },
    },
  },
  {
    request: { query: START_WRITING, variables: { chatId: "chat_1" } },
    result: {
      data: {
        startWriting: {
          id: "chat_1",
          writing: [],
          __typename: "Chat",
        },
      },
    },
  },
  {
    request: { query: END_WRITING, variables: { chatId: "chat_1" } },
    result: {
      data: {
        endWriting: {
          id: "chat_1",
          messages: [
            {
              id: "m1",
              body: "text",
              user: "u1",
              createdAt: "01.01.2020",
              read: ["u1"],
            },
          ],
          __typename: "Chat",
        },
      },
    },
  },
  {
    request: {
      query: WRITE_MESSAGE,
      variables: { chatId: "chat_1", body: "Text" },
    },
    result: {
      data: {
        writeMessage: {
          id: "chat_1",
          messages: [
            {
              id: "m1",
              body: "text",
              user: "u1",
              createdAt: "01.01.2020",
              read: ["u1"],
            },
          ],
          writing: [],
          __typename: "Chat",
        },
      },
    },
  },
  {
    request: {
      query: READ_MESSAGE,
      variables: { chatId: "chat_1", messageIds: ["m1", "m2"] },
    },
    result: {
      data: {
        readMessage: {
          id: "chat_1",
          writing: [],
          __typename: "Chat",
        },
      },
    },
  },
];

describe("<ChatWindow />", () => {
  let wrapper;

  const setOpenChat = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ChatWindow
          userId="u1"
          chatId="ch1"
          openChatName="chat1"
          setOpenChat={setOpenChat}
        />
      </MockedProvider>
    );
  });

  it("Renders Window", () => {
    expect(wrapper.find(Card)).toHaveLength(1);
  });

  it("Renders button + simulate click", () => {
    expect(wrapper.find("button#close-chat")).toHaveLength(1);

    wrapper.find("button#close-chat").simulate("click");
    expect(setOpenChat).toBeCalled();
  });

  it("Renders no ChatMessages before load", () => {
    expect(wrapper.find(ChatMessages)).toHaveLength(0);
  });
});
