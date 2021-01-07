import React, { useContext, useState } from "react";
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
} from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import Comments from "./Comments";
import { useMutation } from "@apollo/react-hooks";
import {
  FETCH_POSTS_QUERY,
  COMMENT_POST_MUTATION,
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  LIKE_POST_MUTATION,
} from "../../util/graphql";
import Likes from "./Likes";

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

  const [commentsMenu, setCommentsMenu] = useState(false);
  const [commentBody, setCommentBody] = useState("");

  const [delPost, { loading: dpLoading }] = useMutation(DELETE_POST_MUTATION, {
    onError(err) {
      console.log(err);
      showError("Error");
    },
    variables: { postId: id },
  });

  const [addComent, { loading: ccLoading }] = useMutation(
    COMMENT_POST_MUTATION,
    {
      update() {
        console.log("COMMMENITNG");
        setCommentBody("");
      },
      variables: { postId: id, body: commentBody },
      onError(err) {
        showError(err.graphQLErrors[0].message);
      },
    }
  );

  const [delComment, { loading: dcLoading }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      onError(err) {
        console.log(err.graphQLErrors);
        showError(err.graphQLErrors[0].message);
      },
    }
  );

  const [addLike, { loading: alLoading }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      showError(err.graphQLErrors[0].message);
    },
  });

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

  let cardContent;

  switch (type) {
    case "TEXT":
      cardContent = (
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
          <Card.Description>{body}</Card.Description>
        </Card.Content>
      );

      break;

    case "IMAGE":
      cardContent = (
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
            <div className="post-image">
              <Image src={process.env.REACT_APP_IMAGES_URL + "/" + image} />
            </div>
          </Card.Description>
        </Card.Content>
      );
      break;

    default:
      cardContent = (
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
          <Card.Meta as={Link} to={`/posts/${id}`}>
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
      );
      break;
  }

  return (
    <Card fluid>
      {cardContent}
      <Segment style={{ borderRadius: "0", borderWidth: "1px 0 0 0" }}>
        <Card.Content extra>
          <Popup
            hoverable
            trigger={
              <Button
                as="div"
                labelPosition="right"
                onClick={() => localUser && addLike()}
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

          <Button as="div" labelPosition="right" onClick={toggleComments}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
          {userId === localUser && (
            <Button
              floated="right"
              color="red"
              content="Delete post"
              icon="delete"
              onClick={delPost}
            />
          )}

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
};

export default PostCard;
