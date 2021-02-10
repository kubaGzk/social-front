import React from "react";
import moment from "moment";

import { Comment } from "semantic-ui-react";

const ChatMessage = (props) => {
  const { message: msg, userImages, userId } = props;

  const commentClass =
    msg.user === userId ? "chat-message-own" : "chat-message";

  return (
    <Comment key={msg.id} className={commentClass}>
      <Comment.Avatar
        src={process.env.REACT_APP_IMAGES_URL + "/" + userImages[msg.user]}
      />
      <Comment.Content>
        <Comment.Text>{msg.body}</Comment.Text>
        <Comment.Metadata>
          {moment(msg.createdAt).fromNow(true)}
        </Comment.Metadata>
      </Comment.Content>
    </Comment>
  );
};

export default ChatMessage;
