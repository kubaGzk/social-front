import React from "react";

import { List } from "semantic-ui-react";
import InviteItem from "./InviteItem";

const InviteItems = (props) => {
  const {
    received,
    invites,
    refetchInvites,
    closeModal,
    confirmInvite,
    declineInvite,
  } = props;

  let invItems = <List.Item>No invitations</List.Item>;

  if (invites.length > 0) {
    invItems = invites.map((inv) => (
      <InviteItem
        received={received}
        refetchInvites={refetchInvites}
        invite={inv}
        key={inv.id}
        closeModal={closeModal}
        confirmInvite={confirmInvite}
        declineInvite={declineInvite}
      />
    ));
  }

  return invItems;
};

export default InviteItems;
