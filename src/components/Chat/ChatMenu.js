import React, { forwardRef } from "react";

import { Button, Card, Feed } from "semantic-ui-react";
import ChatCreateGroup from "./ChatCreateGroup";
import ChatMenuItem from "./ChatMenuItem";
import ChatWindow from "./ChatWindow";

const ChatMenu = forwardRef((props, ref) => {
  const {
    userId,
    chats,
    showChat,
    setShowChat,
    openChat,
    setOpenChat,
    openChatName,
    openCreateGroup,
    setOpenCreateGroup,
  } = props;

  const cardClasses = [];
  if (!showChat) {
    cardClasses.push("display-none");
  }

  const menuClasses = ["chat-menu"];

  if (!showChat && !openChat) {
    menuClasses.push("zero-height");
  }
  return (
    <div className={menuClasses.join(" ")} ref={ref}>
      <Card className={cardClasses.join(" ")}>
        <Card.Content style={{ height: "45px", padding: "0.5em" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Chats
            <Button
              positive
              size="tiny"
              onClick={() => {
                setOpenCreateGroup(true);
                setShowChat(false);
              }}
            >
              Create chat
            </Button>
          </div>
        </Card.Content>
        {chats && (
          <Card.Content style={{ height: "100%", overflowY: "scroll" }}>
            <Feed>
              {chats.length > 0
                ? chats.map((chat) => (
                    <ChatMenuItem
                      userId={userId}
                      chat={chat}
                      key={chat.id}
                      setOpenChat={setOpenChat}
                    />
                  ))
                : "No chats to show, add friends or create new chat to talk with other people"}
            </Feed>
          </Card.Content>
        )}
      </Card>

      {openChat && (
        <ChatWindow
          userId={userId}
          setOpenChat={setOpenChat}
          chatId={openChat}
          openChatName={openChatName}
        />
      )}

      {openCreateGroup && (
        <ChatCreateGroup
          openCreateGroup={openCreateGroup}
          closeModal={() => setOpenCreateGroup(false)}
          setShowChat={setShowChat}
          setOpenChat={setOpenChat}
        />
      )}
    </div>
  );
});

export default ChatMenu;
