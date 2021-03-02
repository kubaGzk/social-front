import React, { useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { DimensionContext } from "../../context/dimension";
import { AuthContext } from "../../context/auth";
import {
  FETCH_INVITES,
  CONFIRM_INVITE,
  DECLINE_INVITE,
} from "../../util/graphql";
import { useErrorHandler } from "../../util/hooks";

import { Grid, Header, List, Loader, Modal } from "semantic-ui-react";
import InviteItems from "./InviteItems";

const Invites = (props) => {
  const { setShowInvites } = props;

  const { userId } = useContext(AuthContext);
  const { width } = useContext(DimensionContext);

  const { errorHandler } = useErrorHandler();

  const { data, loading, refetch: refetchInvites } = useQuery(FETCH_INVITES, {
    fetchPolicy: "cache-and-network",
    onError: errorHandler,
  });

  const [confirmInvite] = useMutation(CONFIRM_INVITE, {
    update: (
      cache,
      {
        data: {
          confirmInvite: { inviteId },
        },
      }
    ) => {
      const cachedId = cache.identify({
        __typename: "UserInfo",
        id: inviteId,
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
    update: (
      cache,
      {
        data: {
          declineInvite: { inviteId },
        },
      }
    ) => {
      console.log(data);
      const cachedId = cache.identify({
        __typename: "UserInfo",
        id: inviteId,
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

  const closeModal = () => {
    setShowInvites(false);
  };

  let invites = { sent: [], received: [] };

  if (data && data.getInvitations) invites = data.getInvitations;

  return (
    <Modal onClose={closeModal} open={true} closeIcon centered={false}>
      <Modal.Content>
        {loading ? (
          <Loader />
        ) : (
          <Grid columns={width <= 767 ? 1 : 2} divided>
            <Grid.Column>
              <Grid.Row>
                <Header>Invites Received</Header>
                <List divided verticalAlign="middle">
                  <InviteItems
                    invites={invites.received}
                    received
                    refetchInvites={refetchInvites}
                    closeModal={closeModal}
                    confirmInvite={confirmInvite}
                    declineInvite={declineInvite}
                  />
                </List>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <Grid.Row>
                <Header>Invites Sent</Header>
                <List>
                  <InviteItems invites={invites.sent} closeModal={closeModal} />
                </List>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default Invites;
