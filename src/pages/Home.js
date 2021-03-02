import React, { useContext, useEffect } from "react";

import { useGetPosts } from "../util/hooks";
import { AuthContext } from "../context/auth";

import { Grid, Loader, TransitionGroup, Message } from "semantic-ui-react";
import PostCard from "../components/Post/PostCard";
import NewPost from "../forms/NewPost";

const Home = (props) => {
  const { error, posts, setError, dataComplete, loading } = useGetPosts();

  const { token } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid style={{ margin: "0" }}>
      <Grid.Column className="post-column">
        {token && <NewPost posts={posts} />}
        {error && (
          <Message
            size="huge"
            error
            style={{ position: "fixed", top: "5%", zIndex: "100" }}
          >
            <Message.Header>Error message</Message.Header>
            {error}
          </Message>
        )}
        <TransitionGroup>
          {posts.map((post) => (
            <Grid.Row key={post.id + "_postcard"} className="post-item">
              <PostCard post={post} showError={setError} />
            </Grid.Row>
          ))}
          {!loading && posts.length === 0 && (
            <Grid.Row>
              <h2>No posts found</h2>
            </Grid.Row>
          )}
          {!dataComplete && (
            <Grid.Row style={{ height: "4rem", paddingTop: "2rem" }}>
              <Loader active style={{ position: "inherit" }} />
            </Grid.Row>
          )}
        </TransitionGroup>
      </Grid.Column>
    </Grid>
  );
};

export default Home;
