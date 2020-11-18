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
import { AuthContext } from "../context/auth";
import Comments from "./Comments";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

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
    deletePost,
    updateComments,
    likePost,
  } = props;

  const { userId: localUser } = useContext(AuthContext);

  const [commentsMenu, setCommentsMenu] = useState(false);
  const [commentBody, setCommentBody] = useState(false);

  const [delPost, { loading: dpLoading, error: dpError }] = useMutation(
    DELETE_POST_MUTATION,
    {
      update(_, { data: { deletePost } }) {
        deletePost(deletePost);
      },
      variables: { postId: id },
    }
  );

  const [addComent, { loading: ccLoading, error: ccError }] = useMutation(
    COMMENT_POST_MUTATION,
    {
      update(_, { data: { createComment } }) {
        updateComments(createComment);
      },
      variables: { postId: id, body: commentBody },
    }
  );

  const [delComment, { loading: dcLoading, error: dcError }] = useMutation(
    DELETE_COMMENT_MUTATION,
    {
      update(_, { data: { deleteComment } }) {
        updateComments(deleteComment);
      },
    }
  );

  const [addLike, { loading: alLoading, error: alError }] = useMutation(
    LIKE_POST_MUTATION,
    {
      update(_, { data: { likePost } }) {
        likePost(likePost);
      },
      variables: { postId: id },
    }
  );

  const toggleComments = () => {
    setCommentsMenu((prev) => !prev);
  };

  const commentBodyHandler = (e) => {
    setCommentBody(e.target.value);
  };

  const deleteCommentHandler = (commentId) => {
    delComment({ variables: { postId: id, commentId } });
  };

  let cardContent;

  switch (type) {
    case "TEXT":
      cardContent = (
        <Card.Content>
          <Image
            floated="left"
            size="mini"
            src={process.env.REACT_APP_IMAGES_URL + "/" + userImage}
          />
          <Card.Header>{`${firstname} ${lastname}`}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
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
          />
          <Card.Header>{`${firstname} ${lastname}`}</Card.Header>
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
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
          <Card.Header>{`${lastname} ${firstname}`}</Card.Header>
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
            trigger={
              <Button
                as="div"
                labelPosition="right"
                onClick={() => addLike(id)}
                onBlur
              >
                <Button color="teal" basic>
                  <Icon name="heart" />
                </Button>

                <Label basic color="teal" pointing="left">
                  {likeCount}
                </Label>
              </Button>
            }
          >
            <Popup.Header>Likes</Popup.Header>
            <Popup.Content>Likessss Many likess</Popup.Content>
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
              onClick={() => deletePost(id)}
            />
          )}

          {commentsMenu && (
            <Comments
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

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likeCount
      likes {
        id
        createdAt
        firstname
        lastname
      }
    }
  }
`;

const COMMENT_POST_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        createdAt
        body
        firstname
        lastname
      }
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $commentId: String!) {
    createComment(postId: $postId, commentId: $commentId) {
      id
      commentCount
      comments {
        id
        createdAt
        body
        firstname
        lastname
      }
    }
  }
`;

export default PostCard;
