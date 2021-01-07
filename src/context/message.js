import shortid from "shortid";
import React, { createContext, useState } from "react";

const INITIAL_CONTEXT = {
  addMessage: () => {},
  removeMessage: () => {},
  messages: [],
};

const MessageContext = createContext(INITIAL_CONTEXT);

const MessageContextProvider = (props) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (text, header, type, cb, timeout = 5000) => {
    const id = shortid();
    setMessages([...messages, { text, header, type, id, cb }]);

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((mes) => mes.id !== id)
      );
    }, timeout);
  };

  const removeMessage = (id) => {
    setMessages((prevMessages) => prevMessages.filter((mes) => mes.id !== id));
  };

  return (
    <MessageContext.Provider
      value={{ messages, addMessage, removeMessage }}
      {...props}
    />
  );
};

export { MessageContextProvider, MessageContext };
