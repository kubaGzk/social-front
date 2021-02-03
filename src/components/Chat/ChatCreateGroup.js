import { useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { List, Modal, Grid, Image } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import UserSearch from "../UserSearch/UserSearch";

const ChatCreateGroup = (props) => {
  const { closeModal } = props;

  //   const [createGroup] = useMutation();

  const { userId, firstname, lastname, image } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const initalUser = {
      id: userId,
      title: `${firstname} ${lastname}`,
      image: process.env.REACT_APP_IMAGES_URL + "/" + image,
    };

    setUsers([initalUser]);
  }, []);

  const addUser = (e, data) => {
    console.log(data.result);
    setUsers((prev) => {
      if (prev.findIndex((usr) => usr.id === data.result.id) < 0) {
        return [...prev, data.result];
      } else {
        return prev;
      }
    });
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((usr) => usr.id !== id));
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
              <List>
                {users.map((usr) => (
                  <List.Item key={usr.id}>
                    <Image avatar src={usr.image} />
                    <List.Content>
                      <List.Header>{usr.title}</List.Header>
                      <List.Description onClick={() => removeUser(usr.id)}>
                        {userId !== usr.id && (
                          <span style={{ color: "red", cursor: "pointer" }}>
                            Remove user
                          </span>
                        )}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default ChatCreateGroup;
