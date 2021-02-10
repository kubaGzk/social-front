import React from "react";

import { List } from "semantic-ui-react";
import InviteItem from "./InviteItem";

const InviteItems = (props) => {
  const { received, invites, refetchInvites, closeModal } = props;

  return invites.length > 0 ? (
    invites.map((inv) => (
      <InviteItem
        received={received}
        refetchInvites={refetchInvites}
        invite={inv}
        key={inv.id}
        closeModal={closeModal}
      />
    ))
  ) : (
    <List.Item>No invitations</List.Item>
  );
};

export default InviteItems;
