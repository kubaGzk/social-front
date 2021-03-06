import React, { useEffect, useState, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  END_WRITING,
  FETCH_CHAT,
  ON_CHANGE_CHAT,
  READ_MESSAGE,
  START_WRITING,
  WRITE_MESSAGE,
} from "../../util/graphql";
import { useErrorHandler } from "../../util/hooks";

import { Comment, Input, Form, Card, Button, Icon } from "semantic-ui-react";
import ChatMessages from "./ChatMessages";

const ChatWindow = (props) => {
  const { userId, chatId, openChatName, setOpenChat } = props;

  const [textMessage, setTextMessage] = useState("");

  const timeoutRef = useRef();

  const { errorHandler } = useErrorHandler();

  const { data, subscribeToMore } = useQuery(FETCH_CHAT, {
    variables: { chatId },
    fetchPolicy: "cache-and-network",
    onError: errorHandler,
  });

  const [startWriting] = useMutation(START_WRITING, {
    variables: { chatId },
    onError: errorHandler,
  });
  const [endWriting] = useMutation(END_WRITING, {
    onError: errorHandler,
  });
  const [sendMessage] = useMutation(WRITE_MESSAGE, {
    variables: { chatId: chatId, body: textMessage },
    onError: errorHandler,
  });
  const [readMessage] = useMutation(READ_MESSAGE, {
    variables: { chatId },
    onError: errorHandler,
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: ON_CHANGE_CHAT,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        if (
          prev.getChat.id !== subscriptionData.data.chatChange.id &&
          chatId !== subscriptionData.data.chatChange.id
        )
          return prev;

        const chatChange = subscriptionData.data.chatChange;
        return { ...prev, getChat: chatChange };
      },
    });

    setTextMessage("");

    return () => {
      unsubscribe();
      endWriting({ variables: { chatId } });
    };
  }, [chatId]);

  let chat;

  if (data && data.getChat) {
    chat = data.getChat;
  }

  useEffect(() => {
    const unread = [];

    if (chat) {
      unread.push(...chat.unread);
    }

    if (unread.length > 0) {
      readMessage({ variables: { messageIds: chat.unread } });
    }
  }, [chat]);

  const writingHandler = (e) => {
    setTextMessage(e.target.value);

    if (chat.writing.indexOf(userId) < 0) {
      startWriting();
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      endWriting({ variables: { chatId: chatId } });
    }, 2000);
  };

  const sendHandler = () => {
    if (textMessage.length > 0) {
      sendMessage();
      setTextMessage("");
    }
  };

  return (
    <Card>
      <Card.Content style={{ height: "45px", padding: "0.5em" }}>
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
            onClick={() => setOpenChat(null)}
            style={{ paddingLeft: "0.6em", paddingRight: "0.6em" }}
          >
            <Icon style={{ margin: "0" }} name="close" id="close-chat-icon" />
          </Button>
        </div>
      </Card.Content>
      <Card.Content
        style={{ height: "100%", overflowY: "scroll", boxSizing: "border-box" }}
        id="chat-messages-content"
      >
        <Comment.Group size="mini">
          {chat && (
            <ChatMessages
              userId={userId}
              users={chat.users}
              messages={chat.messages}
              writing={chat.writing}
            />
          )}
        </Comment.Group>
      </Card.Content>

      <Card.Content style={{ height: "60px" }}>
        <Form reply>
          <Input
            action={{
              color: "teal",
              icon: "send",
              onClick: sendHandler,
            }}
            size="small"
            actionPosition="left"
            placeholder="Message..."
            value={textMessage}
            onChange={writingHandler}
          />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default ChatWindow;
