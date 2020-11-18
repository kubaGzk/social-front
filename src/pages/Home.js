import React, { useContext, useEffect, useState } from "react";
import {  useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PostCard from "../components/PostCard";
import { Grid, Loader, TransitionGroup } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import NewPost from "../forms/NewPost";

const Home = (props) => {
  const { token } = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const [posts, setPosts] = useState();

  const deletePostHandler = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const updateCommentsHandler = (post) => {};

  const likePostHandler = (post) => {};

  useEffect(() => {
    if (data && data.getPosts) {
      setPosts(data.getPosts);
    }
  }, [data]);

  return (
    <Grid style={{ marginTop: "20px" }}>
      <Grid.Column className="post-column">
        {token && <NewPost setPosts={setPosts} posts={posts} />}

        {loading ? (
          <Loader active />
        ) : (
          <TransitionGroup>
            {posts &&
              posts.map((post) => (
                <Grid.Row key={post.id} className="post-item">
                  <PostCard
                    post={post}
                    deletePost={deletePostHandler}
                    updateComments={updateCommentsHandler}
                    likePost={likePostHandler}
                  />
                </Grid.Row>
              ))}
          </TransitionGroup>
        )}
      </Grid.Column>
    </Grid>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
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
      }
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

export default Home;
