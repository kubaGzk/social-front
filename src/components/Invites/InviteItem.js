import React from "react";

import { Link } from "react-router-dom";

import { Button, Image, List } from "semantic-ui-react";

const InviteItem = (props) => {
  const { received, invite, closeModal, confirmInvite, declineInvite } = props;

  let inviteItem = (
    <List.Item key={invite.id}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            size="mini"
            src={process.env.REACT_APP_IMAGES_URL + "/" + invite.image}
          />
          <span style={{ marginLeft: "0.5rem" }}>
            <List.Header
              as={Link}
              to={`/user/${invite.id}`}
              onClick={closeModal}
            >{`${invite.firstname} ${invite.lastname}`}</List.Header>
          </span>
        </div>
        <Button.Group size="mini">
          <Button
            positive={true}
            onClick={() =>
              confirmInvite({ variables: { requestor: invite.id } })
            }
          >
            Accept
          </Button>
          <Button.Or />
          <Button
            negative={true}
            onClick={() =>
              declineInvite({ variables: { requestor: invite.id } })
            }
          >
            Decline
          </Button>
        </Button.Group>
      </div>
    </List.Item>
  );

  if (!received) {
    inviteItem = (
      <List.Item key={invite.id}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            size="mini"
            src={process.env.REACT_APP_IMAGES_URL + "/" + invite.image}
          />
          <span style={{ marginLeft: "0.5rem" }}>
            <List.Header
              as={Link}
              to={`/user/${invite.id}`}
              onClick={closeModal}
            >{`${invite.firstname} ${invite.lastname}`}</List.Header>
          </span>
        </div>
      </List.Item>
    );
  }

  return inviteItem;
};

export default InviteItem;
