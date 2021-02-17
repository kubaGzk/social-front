import React, { useEffect, useContext, useState } from "react";
import ChatMessage from "./ChatMessage";
import { AuthContext } from "../../context/auth";

const ChatMessages = (props) => {
  const { messages, users, writing } = props;

  const { userId } = useContext(AuthContext);

  const [scrollBottom, setScrollBottom] = useState(false);

  const onScrollEvent = (e) => {
    const scrollTop = Math.round(Math.abs(e.target.scrollTop));
    const clientHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;

    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      setScrollBottom(true);
    } else {
      setScrollBottom(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById("chat-messages-content");
    el.scrollTop = el.scrollHeight - el.clientHeight;
    setScrollBottom(true);

    el.addEventListener("scroll", onScrollEvent);
    return () => {
      el.removeEventListener("scroll", onScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (scrollBottom) {
      const el = document.getElementById("chat-messages-content");
      el.scrollTop = el.scrollHeight - el.clientHeight;
      setScrollBottom(true);
    }
  }, [messages, writing]);

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
            <ChatMessage
              message={msg}
              userImages={userImages}
              key={msg.id}
              userId={userId}
            />
          ))}
        </div>
      ) : (
        "No messages to display"
      )}
      {writing &&
        writing.map((id) =>
          id !== userId ? <p key={id}>{userNames[id]} is writing...</p> : ""
        )}
    </>
  );
};

export default ChatMessages;
