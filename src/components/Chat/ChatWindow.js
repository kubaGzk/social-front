import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Comment, Input, Form, Card, Loader, Button } from "semantic-ui-react";
import ChatMessages from "./ChatMessages";

const ChatWindow = (props) => {
  const { chatId } = props;

  //useMutationChat

  const loading = true;

  return (
    <Card>
      <Card.Content style={{ height: "10%", padding: "0.5em" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {`Chat Names`}
          <Button size="tiny" icon="close" />
        </div>
      </Card.Content>
      <Card.Content style={{ height: "75%", overflowY: "scroll" }}>
        <Comment.Group size="mini">
          {loading ? <Loader /> : <ChatMessages />}
        </Comment.Group>
      </Card.Content>

      <Card.Content style={{ height: "15%" }}>
        <Form reply>
          <Input
            action={{
              color: "teal",
              icon: "send",
            }}
            size="small"
            actionPosition="left"
            placeholder="Message..."
          />
        </Form>
      </Card.Content>
    </Card>
  );
};

export default ChatWindow;
