import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import PostCard from "../components/Post/PostCard";
import { Grid, Loader, TransitionGroup, Message } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import NewPost from "../forms/NewPost";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = (props) => {
  const { token } = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  const [error, setError] = useState();

  const setErrorHandler = (message) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <Grid style={{ marginTop: "20px" }}>
      <Grid.Column className="post-column">
        {token && <NewPost posts={posts} />}
        {error && (
          <Message
            size="huge"
            error
            style={{ position: "fixed", top: "5%", zIndex: "500" }}
          >
            <Message.Header>Error message</Message.Header>
            {error}
          </Message>
        )}
        {loading ? (
          <Loader active />
        ) : (
          <TransitionGroup>
            {posts &&
              posts.map((post) => (
                <Grid.Row key={post.id + "_postcard"} className="post-item">
                  <PostCard post={post} showError={setErrorHandler} />
                </Grid.Row>
              ))}
          </TransitionGroup>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Home;
