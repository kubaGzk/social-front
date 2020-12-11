import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query getPosts($offset: Int) {
    getPosts(offset: $offset) {
      id
      type
      body
      image
      createdAt
      firstname
      lastname
      userImage
      userId
      likeCount
      likes {
        id
        createdAt
        firstname
        lastname
        userId
      }
      commentCount
      comments {
        id
        createdAt
        body
        firstname
        lastname
        userId
        image
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likeCount
      likes {
        id
        createdAt
        firstname
        lastname
        userId
      }
    }
  }
`;

export const COMMENT_POST_MUTATION = gql`
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
        userId
        image
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      commentCount
      comments {
        id
        createdAt
        body
        firstname
        lastname
        userId
        image
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $image: Upload!
  ) {
    register(
      registerInput: {
        username: $username
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        image: $image
      }
    ) {
      id
      email
      firstname
      lastname
      image
      createdAt
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      firstname
      lastname
      token
      image
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($body: String!, $image: Upload, $type: PostType!) {
    createPost(body: $body, image: $image, type: $type) {
      id
      body
      createdAt
      userId
      likeCount
      commentCount
      likes {
        id
      }
      comments {
        id
      }
      type
      image
      firstname
      lastname
      userImage
    }
  }
`;

export const VALIDATE_TOKEN = gql`
  mutation validate {
    validateToken {
      id
      email
      lastname
      firstname
      image
    }
  }
`;
