import React, { useContext } from "react";

import { MessageContext } from "../../context/message";

import { TransitionGroup } from "semantic-ui-react";
import MessageBox from "./MessageBox";

const Messages = () => {
  const { messages, removeMessage } = useContext(MessageContext);

  return (
    <TransitionGroup>
      <div className="msg-list">
        {messages.map((msg) => (
          <MessageBox
            key={msg.id}
            header={msg.header}
            text={msg.text}
            type={msg.type}
            cb={msg.cb}
            dismiss={() => removeMessage(msg.id)}
          />
        ))}
      </div>
    </TransitionGroup>
  );
};

export default Messages;
