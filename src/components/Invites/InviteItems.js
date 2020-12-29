import React from "react";
import { Button, List } from "semantic-ui-react";

const InviteItems = (props) => {
  const { type, invites } = props;

  switch (type) {
    case "RECEIVED":
      return invites.length > 0 ? (
        invites.map((inv) => (
          <List.Item 
            key={inv.id}
          >{`${inv.firstname} ${inv.lastname}`}</List.Item>
        ))
      ) : (
        <List.Item>No invitations</List.Item>
      );

    default:
      return invites.length > 0 ? (
        invites.map((inv) => (
          <List.Item key={inv.id}>
            {`${inv.firstname} ${inv.lastname}`}
            <Button.Group>
              <Button positive onClick={() => {}}>
                Accept Invite
              </Button>
              <Button.Or />
              <Button negative onClick={() => {}}>
                Decline Invite
              </Button>
            </Button.Group>
          </List.Item>
        ))
      ) : (
        <List.Item>No invitations</List.Item>
      );
  }
};

export default InviteItems;
