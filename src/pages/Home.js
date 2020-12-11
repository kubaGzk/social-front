import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import PostCard from "../components/Post/PostCard";
import { Grid, Loader, TransitionGroup, Message } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import NewPost from "../forms/NewPost";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { DimensionContext } from "../context/dimension";

const Home = (props) => {
  const { token } = useContext(AuthContext);
  const { height, scrollY, scrollHeight } = useContext(DimensionContext);

  const [postsOffset, setOffset] = useState(0);
  const [dataComplete, setDataComplete] = useState(false);
  const [error, setError] = useState();

  const { loading, data, fetchMore } = useQuery(FETCH_POSTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.getPosts.length === postsOffset) setDataComplete(true);
    },
  });

  let posts = [];
  if (data && data.getPosts) posts = data.getPosts;

  useEffect(() => {
    postsOffset !== posts.length && setOffset(posts.length);
  }, [posts]);

  useEffect(() => {
    //56px - Loader size
    if (height + scrollY + 56 >= scrollHeight && !loading && !dataComplete) {
      fetchMore({ variables: { offset: postsOffset } });
    }
  }, [height, scrollY, scrollHeight]);

  const setErrorHandler = (message) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 5000);
  };

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
          {posts &&
            posts.map((post) => (
              <Grid.Row key={post.id + "_postcard"} className="post-item">
                <PostCard post={post} showError={setErrorHandler} />
              </Grid.Row>
            ))}
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
