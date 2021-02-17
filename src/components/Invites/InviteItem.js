import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/auth";
import { CONFIRM_INVITE, DECLINE_INVITE } from "../../util/graphql";
import { useErrorHandler } from "../../util/hooks";

import { Button, Image, List } from "semantic-ui-react";

const InviteItem = (props) => {
  const { received, invite, refetchInvites, closeModal } = props;

  const { userId } = useContext(AuthContext);

  const { errorHandler } = useErrorHandler();

  const [confirmInvite] = useMutation(CONFIRM_INVITE, {
    variables: { requestor: invite.id },
    update: (cache) => {
      const cachedId = cache.identify({
        __typename: "UserInfo",
        id: invite.id,
      });

      cache.modify({
        id: cachedId,
        fields: {
          invitesSend(cachedInvites) {
            return cachedInvites.filter((inv) => inv !== userId);
          },
          friends(cachedFriends) {
            return [...cachedFriends, userId];
          },
        },
      });

      refetchInvites();
    },
    onError: errorHandler,
  });

  const [declineInvite] = useMutation(DECLINE_INVITE, {
    variables: { requestor: invite.id },
    update: (cache) => {
      const cachedId = cache.identify({
        __typename: "UserInfo",
        id: invite.id,
      });

      cache.modify({
        id: cachedId,
        fields: {
          invitesSend(cachedInvites) {
            return cachedInvites.filter((inv) => inv !== userId);
          },
        },
      });

      refetchInvites();
    },
    onError: errorHandler,
  });

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
          <Button positive onClick={confirmInvite}>
            Accept
          </Button>
          <Button.Or />
          <Button negative onClick={declineInvite}>
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
