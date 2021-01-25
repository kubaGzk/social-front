import React, { useContext } from "react";
import { Feed, Icon } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";

const ChatMenuItem = (props) => {
  const { setOpenChat, chat } = props;

  const { userId } = useContext(AuthContext);

  let chatIcon = <Icon name="group" />;

  if (chat.users.length === 2) {
    const ind = chat.users.findIndex((user) => user.id !== userId);
    chatIcon = (
      <img
        src={`${process.env.REACT_APP_IMAGES_URL}/${chat.users[ind].image}`}
      />
    );
  }

  const chatName = chat.users
    .filter((user) => user.id !== userId)
    .map((user, ind) => {
      if (ind > 0) {
        return `, ${user.firstname} ${user.lastname}`;
      }
      return `${user.firstname} ${user.lastname}`;
    });

  return (
    <Feed.Event >
      <Feed.Label>{chatIcon}</Feed.Label>
      <Feed.Content  onClick={() => setOpenChat(chat.id, chatName)}>
        <Feed.Summary>
          <Feed.User>{chatName}</Feed.User>
        </Feed.Summary>
        <Feed.Meta>{chat.unread} unread messages</Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};

export default ChatMenuItem;
