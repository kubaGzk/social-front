import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
  Comment,
  Input,
  Form,
  Card,
  Loader,
  Button,
  Icon,
} from "semantic-ui-react";
import { FETCH_CHAT, ON_CHANGE_CHAT } from "../../util/graphql";
import ChatMessages from "./ChatMessages";

const ChatWindow = (props) => {
  const { chatId, openChatName, setOpenChat } = props;

  const { data, subscribeToMore } = useQuery(FETCH_CHAT, {
    variables: { chatId },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    subscribeToMore({
      document: ON_CHANGE_CHAT,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        console.log(prev, subscriptionData.data.chatChange);
        const chatChange = subscriptionData.data.chatChange;
        return { ...prev, getChat: chatChange };
      },
    });
  }, []);

  let chat;

  if (data && data.getChat) {
    chat = data.getChat;
  }

  return (
    <Card>
      <Card.Content style={{ height: "10%", padding: "0.5em" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {openChatName}
          <Button
            size="tiny"
            id="close-chat"
            onClick={() => setOpenChat(null, "")}
            style={{ paddingLeft: "0.6em", paddingRight: "0.6em" }}
          >
            <Icon style={{ margin: "0" }} name="close" id="close-chat-icon" />
          </Button>
        </div>
      </Card.Content>
      <Card.Content style={{ height: "75%", overflowY: "scroll" }}>
        <Comment.Group size="mini">
          {chat && (
            <ChatMessages
              users={chat.users}
              messages={chat.messages}
              writing={chat.writing}
            />
          )}
        </Comment.Group>
      </Card.Content>

      <Card.Content style={{ height: "15%" }}>
        <Form reply>
          <Input
            action={{
              color: "teal",
              icon: "send",
            }}
            size="small"
            actionPosition="left"
            placeholder="Message..."
          />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default ChatWindow;
