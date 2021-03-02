import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GraphQLError } from "graphql";

import { AuthContext } from "../../../context/auth";
import { DimensionContext } from "../../../context/dimension";
import {
  COMMENT_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  EDIT_POST,
  LIKE_POST_MUTATION,
} from "../../../util/graphql";

import { Button, Card, Icon } from "semantic-ui-react";
import PostCard from "../../../components/Post/PostCard";
import Comments from "../../../components/Post/Comments";

const mocks = [
  {
    request: { query: DELETE_POST_MUTATION, variables: { postId: "p1" } },
    result: {
      data: {
        deletePost: "message",
      },
    },
  },
  {
    request: {
      query: COMMENT_POST_MUTATION,
      variables: { postId: "p1", body: "Text" },
    },
    result: {
      data: {
        createComment: {
          id: "p1",
          commentCount: "1",
          comments: [
            {
              id: "c1",
              createdAt: new Date(),
              body: "Text",
              firstname: "u1",
              lastname: "u1",
              userId: "u1",
              image: "image",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_COMMENT_MUTATION,
      variables: { postId: "p1", commentId: "c1" },
    },
    result: {
      data: {
        createComment: {
          id: "p1",
          commentCount: "1",
          comments: [
            {
              id: "c1",
              createdAt: new Date(),
              body: "Text",
              firstname: "u1",
              lastname: "u1",
              userId: "u1",
              image: "image",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: LIKE_POST_MUTATION,
      variables: { postId: "p1" },
    },
    result: {
      data: {
        likeCount: {
          id: "p1",
          likesCount: "1",
          likes: ["u1", "u2"],
        },
      },
    },
  },
  {
    request: {
      query: EDIT_POST,
      variables: { postId: "p1", body: "Text2" },
    },
    result: {
      data: {
        likeCount: {
          id: "p1",
          likesCount: "1",
          likes: ["u1", "u2"],
        },
      },
    },
  },
];

const errorMocks = [
  {
    request: { query: DELETE_POST_MUTATION, variables: { postId: "p1" } },
    result: {
      data: { deletePost: "Message" },
    },
  },
  {
    request: {
      query: COMMENT_POST_MUTATION,
      variables: { postId: "p1", body: "Text" },
    },
    result: {
      data: {
        createComment: {
          id: "p1",
          commentCount: "1",
          comments: [
            {
              id: "c1",
              createdAt: new Date(),
              body: "Text",
              firstname: "u1",
              lastname: "u1",
              userId: "u1",
              image: "image",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_COMMENT_MUTATION,
      variables: { postId: "p1", commentId: "c1" },
    },
    result: {
      data: {
        createComment: {
          id: "p1",
          commentCount: "1",
          comments: [
            {
              id: "c1",
              createdAt: new Date(),
              body: "Text",
              firstname: "u1",
              lastname: "u1",
              userId: "u1",
              image: "image",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: LIKE_POST_MUTATION,
      variables: { postId: "p1" },
    },
    result: {
      errors: [new GraphQLError("Error!")],
    },
  },
  {
    request: {
      query: EDIT_POST,
      variables: { postId: "p1", body: "Text2" },
    },
    result: {
      data: {
        likeCount: {
          id: "p1",
          likesCount: "1",
          likes: ["u1", "u2"],
        },
      },
    },
  },
];

describe("<PostCard />", () => {
  let wrapper;

  const showError = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId: "u1" }}>
          <DimensionContext.Provider value={{ width: 800 }}>
            <BrowserRouter>
              <PostCard
                post={{
                  body: "Text",
                  createdAt: new Date(),
                  id: "p1",
                  lastname: "u1",
                  firstname: "u1",
                  likeCount: "1",
                  commentCount: "0",
                  likes: [{ id: "l1", firstname: "u1", lastname: "u1" }],
                  comments: [],
                  userImage: "image",
                  type: "IMAGE",
                  image: "image",
                  userId: "u1",
                }}
                showError={showError}
              />
            </BrowserRouter>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it("Renders PostCard with edit options", () => {
    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find({ content: "Delete" }).find(Button)).toHaveLength(1);
    expect(wrapper.find({ content: "Edit" }).find(Button)).toHaveLength(1);
  });

  it("Triggers error function call when error occurs", async () => {
    wrapper = mount(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <AuthContext.Provider value={{ userId: "u1" }}>
          <DimensionContext.Provider value={{ width: 800 }}>
            <BrowserRouter>
              <PostCard
                post={{
                  body: "Text",
                  createdAt: new Date(),
                  id: "p1",
                  lastname: "u1",
                  firstname: "u1",
                  likeCount: "1",
                  commentCount: "0",
                  likes: [{ id: "l1", firstname: "u1", lastname: "u1" }],
                  comments: [],
                  userImage: "image",
                  type: "IMAGE",
                  image: "image",
                  userId: "u1",
                }}
                showError={showError}
              />
            </BrowserRouter>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );

    wrapper
      .find({
        as: "div",
        labelPosition: "right",
        style: { marginBottom: "0.2rem", marginRight: "0.2rem" },
      })
      .find(Button)
      .first()
      .simulate("click");

    await act(async () => {
      await new Promise((res) => setTimeout(res, 2000));
      wrapper.update();
    });

    expect(showError).toBeCalled();
  });

  it("Renders edit buttons in edit mode", () => {
    wrapper
      .find({ content: "Edit", icon: "edit outline" })
      .find(Button)
      .simulate("click");

    expect(wrapper.find({ content: "Save" }).find(Button)).toHaveLength(1);
    expect(wrapper.find({ content: "Revert" }).find(Button)).toHaveLength(1);
  });

  it("Renders comments when comments are open", () => {
    wrapper.find({ name: "comments" }).find(Icon).simulate("click");

    expect(wrapper.find(Comments)).toHaveLength(1);
  });
});
