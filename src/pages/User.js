import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { useGetPosts } from "../util/hooks";
import { FETCH_USER_INFO_QUERY } from "../util/graphql";

import { Grid, Loader, TransitionGroup, Message } from "semantic-ui-react";
import PostCard from "../components/Post/PostCard";
import UserCard from "../components/Post/UserCard";

const User = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    error,
    posts,
    setError,
    dataComplete,
    loading,
    refetch: refetchPosts,
  } = useGetPosts(props.match.params.id);

  const [localError, setLocalError] = useState();

  const [message, setMessage] = useState();

  const showMessage = (messText) => {
    setMessage(messText);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  let user;

  const { data, refetch: refetchUser, loadingUser } = useQuery(
    FETCH_USER_INFO_QUERY,
    {
      onError: ({ graphQLErrors, networkError }) => {
        let error =
          "Unexpected issue occured, please try again later or contact Admin.";

        if (networkError) {
          console.log(networkError);
        }

        if (graphQLErrors && graphQLErrors[0]) {
          error = graphQLErrors[0].message;
        }
        setLocalError(error);

        setTimeout(() => {
          setLocalError(null);
        }, 3000);
      },
      variables: { userId: props.match.params.id },
      fetchPolicy: "cache-and-network",
    }
  );

  if (data && data.getUserInfo) user = data.getUserInfo;

  return (
    <Grid style={{ margin: "0" }}>
      <Grid.Column className="post-column">
        {message && (
          <Message
            info
            size="small"
            style={{ position: "fixed", top: "5%", zIndex: "100" }}
          >
            <Message.Header>Message</Message.Header>
            {message}
          </Message>
        )}
        <TransitionGroup>
          {user && (
            <UserCard
              user={user}
              refetchUser={refetchUser}
              loading={loadingUser}
              showMessage={showMessage}
              refetchPosts={refetchPosts}
            />
          )}
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
          {(error || localError) && (
            <Message
              size="huge"
              error
              style={{ position: "fixed", top: "5%", zIndex: "100" }}
            >
              <Message.Header>Error message</Message.Header>
              {error || localError}
            </Message>
          )}
        </TransitionGroup>
      </Grid.Column>
    </Grid>
  );
};

export default User;
