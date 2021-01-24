import React, { useEffect } from "react";
import { Comment } from "semantic-ui-react";

const ChatMessages = (props) => {
  const { messages } = props;

  useEffect(() => {
    const chMsgElement = document.findElementById("chat-messages");
    console.log(chMsgElement);
  }, [messages]);

  return messages.length > 0 ? (
    <div id="chat-messages">
      {messages.map((msg) => (
        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
          <Comment.Content>
            <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
            <Comment.Metadata>5 days ago</Comment.Metadata>
          </Comment.Content>
        </Comment>
      ))}
    </div>
  ) : (
    "No messages to display"
  );
};

export default ChatMessages;
