import React from "react";
import { Comment, Header, Form, Button } from "semantic-ui-react";
import moment from "moment";

const Comments = (props) => {
  let comments = "No comments";

  const submitHandler = (e) => {
    e.preventDefault();
    props.submitComment();
  };

  if (props.comments.length > 0) {
    comments = props.comments.map((com) => (
      <Comment>
        <Comment.Content>
          <Comment.Author as="a">
            {com.firstname + " " + com.lastname}
          </Comment.Author>
          <Comment.Metadata>
            <div> {moment(com.createdAt).fromNow(true)}</div>
          </Comment.Metadata>
          <Comment.Text>{com.body}</Comment.Text>
        </Comment.Content>
      </Comment>
    ));
  }

  return (
    <Comment.Group>
      <Header as="h3" dividing>
        Comments
      </Header>
      {comments}
      <Form reply onSubmit={submitHandler}>
        <Form.TextArea onChange={props.editComment} />
        <Button
          content="Add comment"
          labelPosition="left"
          icon="edit"
          primary
        />
      </Form>
    </Comment.Group>
  );
};

export default Comments;
