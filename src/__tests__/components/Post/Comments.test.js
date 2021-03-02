import React from "react";
import { shallow } from "enzyme";

import { Comment, Form, Message } from "semantic-ui-react";
import Comments from "../../../components/Post/Comments";

describe("<Comments />", () => {
  let wrapper;

  const submitComment = jest.fn();
  const deleteComment = jest.fn();
  const editComment = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <Comments
        localUserId={"u1"}
        comments={[
          {
            image: "image",
            fistname: "u1",
            lastname: "u1",
            id: "c1",
            userId: "u1",
          },
          {
            image: "image",
            fistname: "u2",
            lastname: "u2",
            id: "c2",
            userId: "u2",
          },
        ]}
        commentBody=""
        submitComment={submitComment}
        deleteComment={deleteComment}
        editComment={editComment}
      />
    );
  });

  it("Renders comments for auth user with delete option", () => {
    expect(wrapper.find(Comment)).toHaveLength(2);
    expect(wrapper.find(Comment.Action)).toHaveLength(1);
    expect(wrapper.find(Form)).toHaveLength(1);
  });

  it("Simulate delete cick", () => {
    wrapper.find(Comment.Action).simulate("click");
    expect(deleteComment).toBeCalled();
  });

  it("Simulate submit form", () => {
    wrapper
      .find(Form)
      .simulate("submit", { target: "", preventDefault: () => {} });
    expect(submitComment).toBeCalled();
  });

  it("Simulate TextArea change", () => {
    wrapper.find(Form.TextArea).simulate("change");
    expect(editComment).toBeCalled();
  });

  it("Render no elements with not auth warning", () => {
    wrapper = shallow(
      <Comments localUserId={null} comments={[]} commentBody="" />
    );

    expect(wrapper.find(Comment)).toHaveLength(1);
    expect(wrapper.find(Comment.Action)).toHaveLength(0);
    expect(wrapper.find(Form)).toHaveLength(0);
    expect(wrapper.find(Message)).toHaveLength(1);
  });
});
