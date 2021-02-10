import React, { useContext, useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { AuthContext } from "../../context/auth";
import { DimensionContext } from "../../context/dimension";
import {
  FETCH_CHATS,
  ON_CHANGE_CHAT_LIST,
  ON_NEW_CHAT,
} from "../../util/graphql";

import { Button, Ref } from "semantic-ui-react";
import ChatMenu from "./ChatMenu";

const ChatContainer = (props) => {
  const { width } = useContext(DimensionContext);
  const { userId } = useContext(AuthContext);

  const [showChat, setShowChat] = useState(false);
  const [openChat, setOpenChat] = useState();
  const [openChatName, setOpenChatName] = useState("");
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  const btnRef = useRef();
  const menuRef = useRef();

  const { data, loading, subscribeToMore, error } = useQuery(FETCH_CHATS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    subscribeToMore({
      document: ON_NEW_CHAT,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newChat = subscriptionData.data.newChat;
        return { ...prev, getChats: [...prev.getChats, newChat] };
      },
    });

    subscribeToMore({
      document: ON_CHANGE_CHAT_LIST,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const chatChange = subscriptionData.data.chatChange;
        const newChats = [...prev.getChats].map((chat) => {
          if (chat.id === chatChange.id) {
            return chatChange;
          } else {
            return chat;
          }
        });
        return { ...prev, getChats: newChats };
      },
    });

    window.addEventListener("click", onClickHandler);
    return () => window.removeEventListener("click", onClickHandler);
  }, []);

  const onClickHandler = (e) => {
    if (
      !menuRef.current.contains(e.target) &&
      !btnRef.current.contains(e.target) &&
      e.target.id !== "close-chat" &&
      e.target.id !== "close-chat-icon"
    ) {
      setShowChat(false);
      setOpenChat(null);
      setOpenChatName("");
    }
  };

  const openChatHandler = (chat) => {
    if (!chat) {
      setOpenChat(null);
      setOpenChatName("");
    } else {
      const chatName = chat.users
        .filter((user) => user.id !== userId)
        .map((user, ind) => {
          return ind > 0
            ? `, ${user.firstname} ${user.lastname}`
            : `${user.firstname} ${user.lastname}`;
        });

      setOpenChat(chat.id);
      setOpenChatName(chatName);
      if (width <= 767) {
        setShowChat(false);
      }
    }
  };

  const chatButtonHandler = () => {
    setShowChat((p) => !p);
    if (width <= 767) {
      setOpenChat(null);
      setOpenChatName("");
    }
  };

  let chats = [];

  if (data && data.getChats) {
    chats = data.getChats;
  }

  return (
    <div className="chat-container">
      <Ref innerRef={btnRef}>
        <Button
          icon="chat"
          circular
          className="chat-button"
          size="huge"
          color="blue"
          onClick={chatButtonHandler}
        />
      </Ref>

      <ChatMenu
        ref={menuRef}
        showChat={showChat}
        setShowChat={setShowChat}
        openChat={openChat}
        chats={chats}
        chatsLoading={loading}
        setOpenChat={openChatHandler}
        openChatName={openChatName}
        setOpenCreateGroup={setOpenCreateGroup}
        openCreateGroup={openCreateGroup}
      />
    </div>
  );
};

export default ChatContainer;
