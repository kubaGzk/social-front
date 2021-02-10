import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import { DimensionContext } from "../../context/dimension";
import { FETCH_INVITES } from "../../util/graphql";

import { Grid, Header, List, Loader, Modal } from "semantic-ui-react";
import InviteItems from "./InviteItems";

const Invites = (props) => {
  const { setShowInvites } = props;

  const { width } = useContext(DimensionContext);

  const { data, loading, refetch: refetchInvites } = useQuery(FETCH_INVITES, {
    fetchPolicy: "cache-and-network",
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
