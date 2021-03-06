import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../../context/auth";
import { CREATE_CHAT_GROUP } from "../../util/graphql";

import { List, Modal, Grid, Image, Button } from "semantic-ui-react";
import UserSearch from "../UserSearch/UserSearch";
import ChatCreateGroupList from "./ChatCreateGroupList";

const ChatCreateGroup = (props) => {
  const { closeModal, setShowChat, setOpenChat } = props;

  const { userId, firstname, lastname, image } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const initalUser = {
      id: userId,
      title: `${firstname} ${lastname}`,
      image: process.env.REACT_APP_IMAGES_URL + "/" + image,
    };

    setUsers([initalUser]);
  }, []);

  const [createGroup, { loading }] = useMutation(CREATE_CHAT_GROUP, {
    onError: ({ graphQLErrors, networkError }) => {
      let error =
        "Unexpected issue occured, please try again later or contact Admin.";

      if (networkError) {
        console.log(networkError);
      }

      if (graphQLErrors && graphQLErrors[0]) {
        error = graphQLErrors[0].message;
      }
      setError(error);
      setTimeout(() => {
        setError();
      }, 3000);
    },
    onCompleted: (data) => {
      setShowChat(true);
      setOpenChat(data.createChat);
      closeModal();
    },
  });

  const createGroupHandler = () => {
    const usersArr = users
      .filter((usr) => usr.id !== userId)
      .map((usr) => usr.id);

    createGroup({ variables: { users: usersArr } });
  };

  const addUser = (e, data) => {
    if (!loading)
      setUsers((prev) => {
        if (prev.findIndex((usr) => usr.id === data.result.id) < 0) {
          return [...prev, data.result];
        } else {
          return prev;
        }
      });
  };

  const removeUser = (id) => {
    if (!loading) setUsers((prev) => prev.filter((usr) => usr.id !== id));
  };

  return (
    <Modal open={true} onClose={closeModal} closeIcon centered={false}>
      <Modal.Header>Add users to your group</Modal.Header>
      <Modal.Content>
        <Grid columns={2} divided stackable>
          <Grid.Row>
            <Grid.Column>
              <UserSearch
                placeholder="Search for user..."
                resultSelect={addUser}
              />
            </Grid.Column>
            <Grid.Column>
              <ChatCreateGroupList
                userId={userId}
                users={users}
                removeUser={removeUser}
              />
              <Button.Group size="mini">
                <Button
                  positive
                  onClick={createGroupHandler}
                  disabled={users.length <= 1}
                  loading={loading}
                >
                  Create
                </Button>
                <Button.Or />
                <Button negative onClick={closeModal} disabled={loading}>
                  Cancel
                </Button>
              </Button.Group>
              {error && <div className="ui error message">{error}</div>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default ChatCreateGroup;
