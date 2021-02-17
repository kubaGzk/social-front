import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { CREATE_CHAT_GROUP } from "../../../util/graphql";

import { Button, Modal } from "semantic-ui-react";
import ChatCreateGroup from "../ChatCreateGroup";
import { GraphQLError } from "graphql";

const mocks = [
  {
    request: {
      query: CREATE_CHAT_GROUP,
      variables: { users: ["user_1", "user_2"] },
    },
    result: {
      data: {
        createChat: {
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
      },
    },
  },
];

const setError = jest.fn();

const errorMocks = [
  {
    request: {
      query: CREATE_CHAT_GROUP,
      variables: { users: ["user_1", "user_2"] },
    },
    result: {
      errors: [[new GraphQLError("Error!")]],
    },
  },
];

describe("<ChatCreateGroup />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <ChatCreateGroup />
      </MockedProvider>
    );
  });

  it("Renders Modal", () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
  });

  it("Renders two Buttons", () => {
    expect(wrapper.find(Button)).toHaveLength(2);
  });

});
