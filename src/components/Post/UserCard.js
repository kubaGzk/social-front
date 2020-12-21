import React from "react";
import { Card, Icon, Grid, Item, Label, Button } from "semantic-ui-react";

const UserCard = (props) => {
  const {
    user: { firstname, lastname, image, createdAt },
  } = props;

  return (
    <Grid.Row className="post-add">
      <Card fluid>
        <Card.Content>
          <Item.Group>
            <Item>
              <Item.Image
                src={process.env.REACT_APP_IMAGES_URL + "/" + image}
                size="small"
              />

              <Item.Content>
                <Item.Header as="a">{firstname + " " + lastname}</Item.Header>
                <Item.Meta>
                  <span className="cinema">
                    Joined in {new Date(createdAt).getFullYear()}
                  </span>
                </Item.Meta>
                <Item.Description>Description</Item.Description>
                <Item.Extra>
                  <Label> Posts: {/*Number of posts */ 22} </Label>
                  <Label> Friends: {/*Number of posts */ 10}</Label>
                </Item.Extra>
                <Item.Extra>
                  <Button.Group floated="right">
                    <Button primary>
                      Edit profile
                      <Icon name="right chevron" />
                    </Button>

                    <Button>
                      Add as friend
                      <Icon name="right chevron" />
                    </Button>
                  </Button.Group>
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card.Content>
      </Card>
    </Grid.Row>
  );
};

export default UserCard;
