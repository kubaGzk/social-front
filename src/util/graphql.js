import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query getPosts($offset: Int, $userId: ID) {
    getPosts(offset: $offset, userId: $userId) {
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

export const EDIT_POST = gql`
  mutation editPost($postId: ID!, $body: String, $image: Upload) {
    editPost(postId: $postId, body: $body, image: $image) {
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

export const FETCH_USER_LIST = gql`
  query getUserList($text: String!) {
    getUserList(text: $text) {
      id
      firstname
      lastname
      image
    }
  }
`;

export const FETCH_USER_INFO_QUERY = gql`
  query getUserInfo($userId: ID!) {
    getUserInfo(userId: $userId) {
      id
      email
      firstname
      lastname
      createdAt
      image
      description
      friends
      invitesSend
      invitesReceived
      postsCount
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $firstname: String!
    $lastname: String!
    $description: String!
    $image: Upload
  ) {
    updateUser(
      firstname: $firstname
      lastname: $lastname
      description: $description
      image: $image
    ) {
      id
      email
      firstname
      lastname
      createdAt
      image
      friends
      invitesSend
      invitesReceived
      postsCount
    }
  }
`;

export const CREATE_INVITE = gql`
  mutation createInvite($receiver: ID!) {
    createInvite(receiver: $receiver)
  }
`;
export const CONFIRM_INVITE = gql`
  mutation confirmInvite($requestor: ID!) {
    confirmInvite(requestor: $requestor)
  }
`;
export const DECLINE_INVITE = gql`
  mutation declineInvite($requestor: ID!) {
    declineInvite(requestor: $requestor)
  }
`;

export const FETCH_INVITES = gql`
  query getInvitations {
    getInvitations {
      received {
        firstname
        lastname
        image
        id
      }
      sent {
        firstname
        lastname
        image
        id
      }
    }
  }
`;

export const FETCH_CHAT = gql`
  query getChat($chatId: ID!) {
    getChat(chatId: $chatId) {
      id
      users {
        firstname
        lastname
        image
        id
      }
      messages {
        id
        body
        user
        createdAt
        read
      }
      writing
      unread
    }
  }
`;

export const FETCH_CHATS = gql`
  query getChats {
    getChats {
      id
      users {
        firstname
        lastname
        image
        id
      }
      unread
    }
  }
`;

export const WRITE_MESSAGE = gql`
  mutation writeMessage($chatId: ID!, $body: String!) {
    writeMessage(chatId: $chatId, body: $body) {
      id
      messages {
        id
        body
        user
        createdAt
        read
      }
      writing
    }
  }
`;

export const START_WRITING = gql`
  mutation startWriting($chatId: ID!) {
    startWriting(chatId: $chatId) {
      id
      writing
    }
  }
`;
export const END_WRITING = gql`
  mutation endWriting($chatId: ID!) {
    endWriting(chatId: $chatId) {
      id
      messages {
        id
        body
        user
        createdAt
        read
      }
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation readMessage($chatId: ID!, $messageIds: [ID!]) {
    readMessage(chatId: $chatId, messageIds: $messageIds) {
      id
      writing
    }
  }
`;

export const ON_NEW_POST = gql`
  subscription newPost {
    newPost {
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

export const ON_EDIT_POST = gql`
  subscription editedPost {
    editedPost {
      id
      type
      body
      image
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

export const ON_DEL_POST = gql`
  subscription deletedPost {
    deletedPost
  }
`;

export const ON_INVITE = gql`
  subscription invite {
    invite {
      id
      firstname
      lastname
      type
      image
    }
  }
`;

export const ON_NEW_CHAT = gql`
  subscription newChat {
    newChat {
      id
      users {
        firstname
        lastname
        image
        id
      }
      unread
    }
  }
`;

export const ON_CHANGE_CHAT_LIST = gql`
  subscription chatChange {
    chatChange {
      id
      users {
        firstname
        lastname
        image
        id
      }
      unread
    }
  }
`;

export const ON_CHANGE_CHAT = gql`
  subscription chatChange {
    chatChange {
      id
      users {
        firstname
        lastname
        image
        id
      }
      messages {
        id
        body
        user
        createdAt
        read
      }
      writing
      unread
    }
  }
`;
