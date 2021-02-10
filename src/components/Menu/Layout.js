import { useApolloClient, useSubscription } from "@apollo/client";
import React, { useContext, useState } from "react";

import { DimensionContext } from "../../context/dimension";
import { MessageContext } from "../../context/message";
import { AuthContext } from "../../context/auth";
import { FETCH_USER_INFO_QUERY, ON_INVITE } from "../../util/graphql";

import { Sidebar, Grid, Menu, Segment } from "semantic-ui-react";
import ChatContainer from "../Chat/ChatContainer";
import Invites from "../Invites/Invites";
import MenuBar from "./MenuBar";
import MenuItems from "./MenuItems";
import Messages from "../Message/Messages";

const Layout = (props) => {
  const { children } = props;

  const { width } = useContext(DimensionContext);
  const { addMessage } = useContext(MessageContext);
  const { userId, token } = useContext(AuthContext);

  const client = useApolloClient();

  const [showSidebar, setShowSidebar] = useState(false);
  const [showInvites, setShowInvites] = useState(false);

  useSubscription(ON_INVITE, {
    skip: !!!token,
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data) {
        switch (data.invite.type) {
          case "RECEIVED":
            addMessage(
              `You have new invite from ${data.invite.firstname} ${data.invite.lastname}.`,
              "Invitation",
              "info",
              () => setShowInvites(true)
            );

            let clientDataA = client.cache.readQuery({
              query: FETCH_USER_INFO_QUERY,
              variables: { userId: data.invite.id },
            });

            if (clientDataA && clientDataA.getUserInfo) {
              const newInvites = [...clientDataA.getUserInfo.invitesSend];
              newInvites.push(userId);

              client.cache.writeQuery({
                query: FETCH_USER_INFO_QUERY,
                variables: { userId: data.invite.id },
                data: {
                  ...clientDataA,
                  getUserInfo: {
                    ...clientDataA.getUserInfo,
                    invitesSend: newInvites,
                  },
                },
              });
            }
            break;

          case "CONFIRMED":
            addMessage(
              `You are now friends with ${data.invite.firstname} ${data.invite.lastname}.`,
              "Invitation",
              "info"
            );

            let clientDataB = client.cache.readQuery({
              query: FETCH_USER_INFO_QUERY,
              variables: { userId: data.invite.id },
            });

            if (clientDataB && clientDataB.getUserInfo) {
              const newInvites = [
                ...clientDataB.getUserInfo.invitesReceived,
              ].filter((inv) => inv !== userId);

              const newFriends = [...clientDataB.getUserInfo.friends, userId];

              client.cache.writeQuery({
                query: FETCH_USER_INFO_QUERY,
                variables: { userId: data.invite.id },
                data: {
                  ...clientDataB,
                  getUserInfo: {
                    ...clientDataB.getUserInfo,
                    invitesReceived: newInvites,
                    friends: newFriends,
                  },
                },
              });
            }
            break;

          default:
            break;
        }
      }
    },
  });

  const toggleSidebarMenu = () => {
    setShowSidebar((p) => !p);
  };

  const showMenuRule = showSidebar && width <= 767;

  return (
    <>
      <Grid columns={1} style={{ margin: "0", minHeight: "100vh" }}>
        <Grid.Column style={{ padding: "0" }}>
          <Sidebar.Pushable
            as={Segment}
            style={{ transform: "none", backgroundColor: "#f2f2f2" }}
          >
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              inverted
              onHide={() => {
                showSidebar && toggleSidebarMenu();
              }}
              vertical
              visible={showMenuRule}
              style={{ position: "fixed", maxWidth: "80vw" }}
            >
              <MenuItems
                toggleMenu={toggleSidebarMenu}
                width={width}
                toggleInvites={() => setShowInvites(true)}
              />
            </Sidebar>
            <Sidebar.Pusher dimmed={showMenuRule}>
              <Segment basic style={{ padding: "0" }}>
                <MenuBar
                  toggleMenu={toggleSidebarMenu}
                  width={width}
                  toggleInvites={() => setShowInvites(true)}
                />
                {children}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <Messages />
        </Grid.Column>
      </Grid>
      {showInvites && (
        <Invites showInvites={showInvites} setShowInvites={setShowInvites} />
      )}
      {token && <ChatContainer />}
    </>
  );
};

export default Layout;
