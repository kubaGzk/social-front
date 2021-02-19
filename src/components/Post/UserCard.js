import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../../context/auth";
import { DimensionContext } from "../../context/dimension";
import { MessageContext } from "../../context/message";
import {
  CONFIRM_INVITE,
  CREATE_INVITE,
  DECLINE_INVITE,
} from "../../util/graphql";
import { useErrorHandler } from "../../util/hooks";

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
import EditProfile from "../../forms/EditProfile";

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
    refetchUser,
    refetchPosts,
  } = props;

  const { userId, token } = useContext(AuthContext);
  const { addMessage } = useContext(MessageContext);
  const { width } = useContext(DimensionContext);

  const [editMode, setEditMode] = useState(false);

  const { errorHandler } = useErrorHandler();

  const [sendInvite, { loading: siLoading }] = useMutation(CREATE_INVITE, {
    variables: { receiver: id },
    update: (
      c,
      {
        data: {
          createInvite: { message },
        },
      }
    ) => {
      addMessage(message, "Invite", "info");
      refetchUser();
    },
    onError: errorHandler,
  });

  const [confirmInvite, { loading: ciLoading }] = useMutation(CONFIRM_INVITE, {
    variables: { requestor: id },
    update: (
      c,
      {
        data: {
          confirmInvite: { message },
        },
      }
    ) => {
      addMessage(message, "Invite", "info");
      refetchUser();
    },
    onError: errorHandler,
  });

  const [declineInvite, { loading: diLoading }] = useMutation(DECLINE_INVITE, {
    variables: { requestor: id },
    update: (
      c,
      {
        data: {
          declineInvite: { message },
        },
      }
    ) => {
      addMessage(message, "Invite", "info");
      refetchUser();
    },
    onError: errorHandler,
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
                  description={description}
                  id={id}
                  setEditMode={setEditMode}
                  refetchUser={refetchUser}
                  refetchPosts={refetchPosts}
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
                        <Button.Group
                          floated="right"
                          size={width <= 768 ? "tiny" : "medium"}
                        >
                          {buttons}
                        </Button.Group>
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
