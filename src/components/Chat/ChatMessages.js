import React, { useEffect } from "react";
import moment from "moment";
import { Comment } from "semantic-ui-react";

const ChatMessages = (props) => {
  const { messages, users, writing } = props;

  useEffect(() => {
    const chMsgElement = document.getElementById("chat-messages");
    console.log(chMsgElement);
  }, [messages]);

  const userNames = {};
  const userImages = {};

  for (const usr of users) {
    userNames[usr.id] = usr.firstname;
    userImages[usr.id] = usr.image;
  }

  return (
    <>
      {messages.length > 0 ? (
        <div id="chat-messages">
          {messages.map((msg) => (
            <Comment key={msg.id}>
              <Comment.Avatar
                src={
                  process.env.REACT_APP_IMAGES_URL + "/" + userImages[msg.user]
                }
              />
              <Comment.Content>
                <Comment.Text>{msg.body}</Comment.Text>
                <Comment.Metadata>
                  {moment(msg.createdAt).fromNow(true)}
                </Comment.Metadata>
              </Comment.Content>
            </Comment>
          ))}
        </div>
      ) : (
        "No messages to display"
      )}
      {writing.map((id) => (
        <p>{userNames[id]} is writing...</p>
      ))}
    </>
  );
};

export default ChatMessages;
