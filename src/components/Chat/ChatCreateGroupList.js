import React from "react";

import { Image, List } from "semantic-ui-react";

const ChatCreateGroupList = (props) => {
  const { userId, users, removeUser } = props;

  return (
    <List>
      {users.map((usr) => (
        <List.Item key={usr.id}>
          <Image avatar src={usr.image} />
          <List.Content>
            <List.Header>{usr.title}</List.Header>
            {userId !== usr.id && (
              <List.Description onClick={() => removeUser(usr.id)}>
                <span style={{ color: "red", cursor: "pointer" }}>
                  Remove user
                </span>
              </List.Description>
            )}
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default ChatCreateGroupList;
