import { useQuery } from "@apollo/client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Button, Popup, Ref } from "semantic-ui-react";
import { DimensionContext } from "../../context/dimension";
import {
  FETCH_CHATS,
  ON_CHANGE_CHAT_LIST,
  ON_NEW_CHAT,
} from "../../util/graphql";
import ChatMenu from "./ChatMenu";

const ChatContainer = (props) => {
  const { width } = useContext(DimensionContext);

  const [show, setShow] = useState(false);
  const [openChat, setOpenChat] = useState();
  const [openChatName, setOpenChatName] = useState("");
  const btnRef = useRef();
  const menuRef = useRef();

  const onClickHandler = (e) => {
    if (
      !menuRef.current.contains(e.target) &&
      !btnRef.current.contains(e.target) &&
      e.target.id !== "close-chat" &&
      e.target.id !== "close-chat-icon"
    ) {
      setShow(false);
      setOpenChat(null);
      setOpenChatName("");
    }
  };

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

  const openChatHandler = (chatId, name) => {
    setOpenChat(chatId);
    setOpenChatName(name || "");
    if (width <= 767) {
      setShow(false);
    }
  };

  const chatButtonHandler = () => {
    setShow((p) => !p);
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
        show={show}
        openChat={openChat}
        chats={chats}
        chatsLoading={loading}
        setOpenChat={openChatHandler}
        openChatName={openChatName}
      />
    </div>
  );
};

export default ChatContainer;
