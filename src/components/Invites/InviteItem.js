import { useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Image, List } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { CONFIRM_INVITE, DECLINE_INVITE } from "../../util/graphql";

const InviteItem = (props) => {
  const { received, invite, refetchInvites, closeModal } = props;

  const { userId } = useContext(AuthContext);

  const [confirmInvite] = useMutation(CONFIRM_INVITE, {
    onError(err) {
      console.log(err);
    },
    variables: { requestor: invite.id },
    update(cache, { data: { confirmInvite } }) {
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
  });

  const [declineInvite] = useMutation(DECLINE_INVITE, {
    onError(err) {
      console.log(err);
    },
    variables: { requestor: invite.id },
    update(cache, { data: { declineInvite } }) {
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
  });

  if (!received) {
    return (
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

  return (
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
};

export default InviteItem;
