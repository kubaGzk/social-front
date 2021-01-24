import React, { forwardRef } from "react";
import { Button, Card, Feed, Loader } from "semantic-ui-react";
import ChatMenuItem from "./ChatMenuItem";
import ChatWindow from "./ChatWindow";

const ChatMenu = forwardRef((props, ref) => {
  const { chats, show, openChat, chatsLoading, setOpenChat } = props;

  const classes = ["chat-menu"];
  if (!show) {
    classes.push("chat-none");
  }

  return (
    <div className={classes.join(" ")} ref={ref}>
      <Card>
        <Card.Content style={{ height: "10%", padding: "0.5em" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Chats
            <Button positive size="tiny">
              Create chat
            </Button>
          </div>
        </Card.Content>
        {chatsLoading || !chats ? (
          <Loader />
        ) : (
          <Card.Content style={{ height: "90%", overflowY: "scroll" }}>
            <Feed>
              {chats.length > 0
                ? chats.map((chat) => (
                    <ChatMenuItem
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

      {openChat && <ChatWindow chatId={openChat} />}
    </div>
  );
});

export default ChatMenu;
