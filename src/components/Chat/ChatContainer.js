import { useQuery } from "@apollo/client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Button, Popup, Ref } from "semantic-ui-react";
import { DimensionContext } from "../../context/dimension";
import { FETCH_CHATS } from "../../util/graphql";
import ChatMenu from "./ChatMenu";

const ChatContainer = (props) => {
  const { width } = useContext(DimensionContext);

  const [show, setShow] = useState(false);
  const [openChat, setOpenChat] = useState();
  const btnRef = useRef();
  const menuRef = useRef();

  const onClickHandler = (e) => {
    setShow((prevShow) => {
      if (menuRef.current.contains(e.target)) {
        return true;
      }
      if (!prevShow && btnRef.current.contains(e.target)) {
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    window.addEventListener("click", onClickHandler);

    return () => window.removeEventListener("click", onClickHandler);
  }, []);

  const openChatHandler = (chatId) => {
    setOpenChat(chatId);

    if (width <= 767) {
      setShow(false);
    }
  };

  const { data, loading } = useQuery(FETCH_CHATS);

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
        />
      </Ref>
      <ChatMenu
        ref={menuRef}
        show={show}
        openChat={openChat}
        chats={chats}
        chatsLoading={loading}
        setOpenChat={openChatHandler}
      />
    </div>
  );
};

export default ChatContainer;
