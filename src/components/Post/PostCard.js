import React, { useContext, useState } from "react";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import {
  COMMENT_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  EDIT_POST,
  LIKE_POST_MUTATION,
} from "../../util/graphql";
import { useErrorHandler, useForm } from "../../util/hooks";
import { DimensionContext } from "../../context/dimension";
import { AuthContext } from "../../context/auth";

import {
  Loader,
  Card,
  Image,
  Icon,
  Label,
  Button,
  Popup,
  Dimmer,
  Segment,
  Form,
  Dropdown,
} from "semantic-ui-react";
import Likes from "./Likes";
import Comments from "./Comments";

const PostCard = (props) => {
  const {
    post: {
      body,
      createdAt,
      id,
      lastname,
      firstname,
      likeCount,
      commentCount,
      likes,
      comments,
      userImage,
      type,
      image,
      userId,
    },
    showError,
  } = props;

  const { userId: localUser } = useContext(AuthContext);
  const { width } = useContext(DimensionContext);

  const [commentsMenu, setCommentsMenu] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [values, onChange, onSubmit] = useForm(editPostHandler, {
    body: body || "",
    image: "",
  });

  const { errorHandler } = useErrorHandler();

  const [delPost, { loading: dpLoading }] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId: id },
    onError: errorHandler,
  });

  const [addComent, { loading: ccLoading }] = useMutation(
    COMMENT_POST_MUTATION,
    {
      update: () => {
        setCommentBody("");
      },
      variables: { postId: id, body: commentBody },
      onError: ({ networkError, graphQLErrors }) => {
        let error =
          "Unexpected issue occured, please try again later or contact Admin.";
        if (networkError) {
          console.log(networkError);
        }

        if (graphQLErrors && graphQLErrors[0]) {
          error = graphQLErrors[0].message;
        }
        showError(error);
      },
    }
  );

  const [delComment, { loading: dcLoading }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      onError: ({ networkError, graphQLErrors }) => {
        let error =
          "Unexpected issue occured, please try again later or contact Admin.";
        if (networkError) {
          console.log(networkError);
        }

        if (graphQLErrors && graphQLErrors[0]) {
          error = graphQLErrors[0].message;
        }
        showError(error);
      },
    }
  );

  const [addLike, { loading: alLoading }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError: ({ networkError, graphQLErrors }) => {
      let error =
        "Unexpected issue occured, please try again later or contact Admin.";
      if (networkError) {
        console.log(networkError);
      }

      if (graphQLErrors && graphQLErrors[0]) {
        error = graphQLErrors[0].message;
      }
      showError(error);
    },
  });

  const [editPost, { loading: epLoading }] = useMutation(EDIT_POST, {
    update: () => {
      setEditMode(false);
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (networkError) {
        console.log(networkError);
        setErrors({
          general:
            "Unexpected issue occured, please try again later or contact Admin.",
        });
      }

      if (
        graphQLErrors &&
        graphQLErrors[0] &&
        graphQLErrors[0]?.extensions?.exception?.errors
      ) {
        setErrors(graphQLErrors[0].extensions.exception.errors);
      } else {
        setErrors({
          general:
            "Unexpected issue occured, please try again later or contact Admin.",
        });
      }
    },
    variables: { postId: id, ...values },
  });

  function editPostHandler() {
    editPost();
  }

  const toggleComments = () => {
    setCommentsMenu((prev) => !prev);
  };

  const commentBodyHandler = (e) => {
    setCommentBody(e.target.value);
  };

  const deleteCommentHandler = (commentId) => {
    delComment({ variables: { postId: id, commentId } });
  };

  let invertedLike = false;

  if (likes.findIndex((like) => like.userId === localUser) !== -1)
    invertedLike = true;

  let postCard = (
    <Card fluid>
      <Card.Content>
        <Image
          floated="left"
          size="mini"
          src={process.env.REACT_APP_IMAGES_URL + "/" + userImage}
          style={{ borderRadius: "0.25rem" }}
        />
        <Card.Header
          as={Link}
          to={`/user/${userId}`}
        >{`${firstname} ${lastname}`}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          <p>{body}</p>
          {type === "IMAGE" && (
            <div className="post-image">
              <Image src={process.env.REACT_APP_IMAGES_URL + "/" + image} />
            </div>
          )}
        </Card.Description>
      </Card.Content>
      <Segment style={{ borderRadius: "0", borderWidth: "1px 0 0 0" }}>
        <Card.Content extra className="post-card-buttons">
          <Button.Group>
            <Popup
              hoverable
              trigger={
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => localUser && addLike()}
                  style={{ marginBottom: "0.2rem", marginRight: "0.2rem" }}
                >
                  <Button color="teal" basic={!invertedLike}>
                    <Icon name="heart" />
                  </Button>

                  <Label basic color="teal" pointing="left">
                    {likeCount}
                  </Label>
                </Button>
              }
            >
              <Popup.Header>Likes</Popup.Header>
              <Popup.Content>
                <Likes likes={likes} />
              </Popup.Content>
            </Popup>

            <Button
              as="div"
              labelPosition="right"
              onClick={toggleComments}
              style={{ marginBottom: "0.2rem" }}
            >
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          </Button.Group>
          {userId === localUser &&
            !editMode &&
            (width <= 768 ? (
              <Dropdown icon="ellipsis vertical">
                <Dropdown.Menu direction="left">
                  <Dropdown.Item
                    text="Delete"
                    icon="delete"
                    onClick={delPost}
                  />
                  <Dropdown.Item
                    text="Edit"
                    icon="edit outline"
                    onClick={() => setEditMode(true)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button.Group className={"right floated"}>
                <Button
                  color="red"
                  content="Delete"
                  icon="delete"
                  onClick={delPost}
                />
                <Button
                  color="blue"
                  content="Edit"
                  icon="edit outline"
                  onClick={() => setEditMode(true)}
                />
              </Button.Group>
            ))}
          {commentsMenu && (
            <Comments
              localUserId={localUser}
              commentBody={commentBody}
              comments={comments}
              editComment={commentBodyHandler}
              submitComment={addComent}
              deleteComment={deleteCommentHandler}
            />
          )}

          <Dimmer
            active={dpLoading || ccLoading || dcLoading || alLoading}
            inverted
          >
            <Loader />
          </Dimmer>
        </Card.Content>
      </Segment>
    </Card>
  );

  if (userId === localUser && editMode) {
    postCard = (
      <Card fluid>
        <Card.Content>
          <Image
            floated="left"
            size="mini"
            src={process.env.REACT_APP_IMAGES_URL + "/" + userImage}
            style={{ borderRadius: "0.25rem" }}
          />
          <Card.Header
            as={Link}
            to={`/user/${userId}`}
          >{`${firstname} ${lastname}`}</Card.Header>
          <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
          <Card.Description>
            {type === "IMAGE" && (
              <div className="post-image">
                <Image src={process.env.REACT_APP_IMAGES_URL + "/" + image} />
              </div>
            )}
          </Card.Description>
          <Form noValidate className={epLoading ? "loading" : ""}>
            <Form.TextArea
              label="Body"
              placeholder="What are you thinking about..."
              name="body"
              value={values.body}
              onChange={onChange}
              type="text"
            />

            {type === "IMAGE" && (
              <Form.Input
                label="Change post image"
                name="image"
                onChange={onChange}
                type="file"
                accept="image/*"
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: " nowrap",
                }}
              />
            )}
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </Card.Content>
        <Segment style={{ borderRadius: "0", borderWidth: "1px 0 0 0" }}>
          <Button.Group floated="right">
            <Button positive content="Save" onClick={onSubmit} />
            <Button.Or />
            <Button
              negative
              content="Revert"
              onClick={() => setEditMode(false)}
            />
          </Button.Group>
        </Segment>
      </Card>
    );
  }

  return postCard;
};

export default PostCard;
