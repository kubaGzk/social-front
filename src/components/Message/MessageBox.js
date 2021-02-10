import React, { useContext } from "react";

import { DimensionContext } from "../../context/dimension";

import { Message } from "semantic-ui-react";

const MessageBox = (props) => {
  const { header, text, type, cb, dismiss } = props;

  const { width } = useContext(DimensionContext);

  let msgSize = "small";

  if (width <= 767) msgSize = "mini";

  const callback = () => {
    cb && cb();
  };

  const pointer = { cursor: "pointer" };

  switch (type) {
    case "info":
      return (
        <Message size={msgSize} info onDismiss={dismiss}>
          <Message.Header onClick={callback} style={cb && pointer}>
            {header}
          </Message.Header>
          <Message.Content onClick={callback} style={cb && pointer}>
            {text}
          </Message.Content>
        </Message>
      );

    case "positive":
      return (
        <Message size={msgSize} positive onDismiss={dismiss}>
          <Message.Header onClick={callback} style={cb && pointer}>
            {header}
          </Message.Header>
          <Message.Content onClick={callback} style={cb && pointer}>
            {text}
          </Message.Content>
        </Message>
      );

    case "warning":
      return (
        <Message size={msgSize} warning onDismiss={dismiss}>
          <Message.Header onClick={callback} style={cb && pointer}>
            {header}
          </Message.Header>
          <Message.Content onClick={callback} style={cb && pointer}>
            {text}
          </Message.Content>
        </Message>
      );

    case "negative":
      return (
        <Message size={msgSize} negative onDismiss={dismiss}>
          <Message.Header onClick={callback} style={cb && pointer}>
            {header}
          </Message.Header>
          <Message.Content onClick={callback} style={cb && pointer}>
            {text}
          </Message.Content>
        </Message>
      );

    default:
      return (
        <Message size={msgSize} onDismiss={dismiss}>
          <Message.Header onClick={callback} style={cb && pointer}>
            {header}
          </Message.Header>
          <Message.Content onClick={callback} style={cb && pointer}>
            {text}
          </Message.Content>
        </Message>
      );
  }
};

export default MessageBox;
