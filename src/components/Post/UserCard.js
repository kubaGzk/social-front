import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  Card,
  Icon,
  Grid,
  Item,
  Label,
  Button,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import EditProfile from "../../forms/EditProfile";
import {
  CONFIRM_INVITE,
  CREATE_INVITE,
  DECLINE_INVITE,
} from "../../util/graphql";

const UserCard = (props) => {
  const {
    user: {
      firstname,
      lastname,
      image,
      createdAt,
      friends,
      invitesReceived,
      invitesSend,
      postsCount,
      description,
      id,
    },
    loading,
    refetch,
    showMessage,
  } = props;

  const { userId, token } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [sendInvite, { loading: siLoading }] = useMutation(CREATE_INVITE, {
    onError(err) {
      console.log(err);
    },
    variables: { receiver: id },
    update(c, { data: { createInvite } }) {
      showMessage(createInvite);
      refetch();
    },
  });

  const [confirmInvite, { loading: ciLoading }] = useMutation(CONFIRM_INVITE, {
    onError(err) {
      console.log(err);
    },
    variables: { requestor: id },
    update(c, { data: { confirmInvite } }) {
      showMessage(confirmInvite);
      refetch();
    },
  });

  const [declineInvite, { loading: diLoading }] = useMutation(DECLINE_INVITE, {
    onError(err) {
      console.log(err);
    },
    variables: { requestor: id },
    update(c, { data: { declineInvite } }) {
      showMessage(declineInvite);
      refetch();
    },
  });

  let buttons;

  if (userId === id) {
    buttons = (
      <Button primary onClick={() => setEditMode(true)}>
        <Icon name="edit outline" />
        Edit profile
      </Button>
    );
  } else if (invitesSend.indexOf(userId) !== -1) {
    buttons = (
      <>
        <Button positive onClick={confirmInvite}>
          Accept Invite
        </Button>
        <Button.Or />
        <Button negative onClick={declineInvite}>
          Decline Invite
        </Button>
      </>
    );
  } else if (invitesReceived.indexOf(userId) !== -1) {
    buttons = (
      <Button disabled labelPosition="right">
        <Icon name="mail outline" />
        Invite has been sent
      </Button>
    );
  } else if (friends.indexOf(userId) !== -1) {
    buttons = (
      <Button disabled labelPosition="right">
        <Icon name="group" />
        You are friends
      </Button>
    );
  } else {
    buttons = (
      <Button primary onClick={sendInvite}>
        <Icon name="address book outline" />
        Send invite
      </Button>
    );
  }

  return (
    <Grid.Row className="post-add">
      <Card fluid>
        <Card.Content>
          <Item.Group style={{ marginBottom: "0" }}>
            <Item>
              {editMode ? (
                <EditProfile
                  firstname={firstname}
                  lastname={lastname}
                  image={image}
                  id={id}
                  setEditMode={setEditMode}
                />
              ) : (
                <>
                  <Item.Image
                    src={process.env.REACT_APP_IMAGES_URL + "/" + image}
                    size="small"
                  />
                  <Item.Content>
                    <Item.Header as="a">
                      {firstname + " " + lastname}
                    </Item.Header>
                    <Item.Meta>
                      <span className="cinema">
                        Joined in {new Date(createdAt).getFullYear()}
                      </span>
                    </Item.Meta>
                    <Item.Description>{description || "..."}</Item.Description>
                    <Item.Extra>
                      <Label> Posts: {postsCount} </Label>
                      <Label> Friends: {friends.length}</Label>
                    </Item.Extra>
                    {token && (
                      <Item.Extra>
                        <Button.Group floated="right">{buttons}</Button.Group>
                      </Item.Extra>
                    )}
                  </Item.Content>
                </>
              )}
            </Item>
          </Item.Group>

          <Dimmer
            active={loading || siLoading || ciLoading || diLoading}
            inverted
          >
            <Loader />
          </Dimmer>
        </Card.Content>
      </Card>
    </Grid.Row>
  );
};

export default UserCard;
