import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import {
  Comment,
  Header,
  Form,
  Button,
  Message,
  Icon,
} from "semantic-ui-react";

const Comments = (props) => {
  const {
    localUserId,
    comments,
    commentBody,
    submitComment,
    deleteComment,
    editComment,
  } = props;

  let comms = "No comments";

  const submitHandler = (e) => {
    e.preventDefault();
    submitComment();
  };

  if (comments.length > 0) {
    comms = comments.map((com) => (
      <Comment key={com.id}>
        <Comment.Avatar
          src={process.env.REACT_APP_IMAGES_URL + "/" + com.image}
        />
        <Comment.Content>
          <Comment.Author as={Link} to={`/user/${com.userId}`}>
            {com.firstname + " " + com.lastname}
          </Comment.Author>
          <Comment.Metadata>
            <div> {moment(com.createdAt).fromNow(true)}</div>
          </Comment.Metadata>
          <Comment.Text>{com.body}</Comment.Text>

          <Comment.Actions>
            {com.userId === localUserId && (
              <Comment.Action onClick={() => deleteComment(com.id)}>
                <Icon name="delete" />
                Delete
              </Comment.Action>
            )}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    ));
  }

  return (
    <Comment.Group>
      <Header as="h3" dividing>
        Comments
      </Header>
      {comms}
      {localUserId ? (
        <Form reply onSubmit={submitHandler}>
          <Form.TextArea
            onChange={editComment}
            value={commentBody}
            placeholder="Your comment..."
          />
          <Button
            disabled={!commentBody}
            content="Add comment"
            labelPosition="left"
            icon="edit"
            primary
          />
        </Form>
      ) : (
        <Comment>
          <Message warning>Log in to add comments</Message>
        </Comment>
      )}
    </Comment.Group>
  );
};

export default Comments;
