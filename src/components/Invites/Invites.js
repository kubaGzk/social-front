import { useQuery } from "@apollo/client";
import React, { useRef, useEffect } from "react";
import { Grid, Header, List, Loader, Modal } from "semantic-ui-react";
import { FETCH_INVITES } from "../../util/graphql";
import InviteItems from "./InviteItems";

const Invites = (props) => {
  const { showInvites, setShowInvites } = props;

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const { data, loading } = useQuery(FETCH_INVITES, "network-only");

  let invites = { sent: [], received: [] };

  if (data && data.getInvitations) invites = data.getInvitations;

  const closeModal = () => {
    mounted.current && setShowInvites(false);
  };

  return (
    <Modal
      onClose={closeModal}
      open={showInvites}
      onUnmount={() => (mounted.current = false)}
      closeIcon
      centered={false}
    >
      <Modal.Content>
        {loading ? (
          <Loader />
        ) : (
          <Grid columns={2} divided>
            <Grid.Column>
              <Grid.Row>
                <Header>Invites Received</Header>
                <List>
                  <InviteItems invites={invites.received} type="RECEIVED" />
                </List>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <Grid.Row>
                <Header>Invites Sent</Header>
                <List>
                  <InviteItems invites={invites.sent} />
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
