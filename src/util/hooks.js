import { useApolloClient, useQuery } from "@apollo/client";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/auth";
import { DimensionContext } from "../context/dimension";
import { MessageContext } from "../context/message";
import {
  FETCH_POSTS_QUERY,
  ON_DEL_POST,
  ON_EDIT_POST,
  ON_NEW_POST,
} from "./graphql";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e) => {
    if (e.target.name === "image") {
      const val = e.target.files.length === 1 ? e.target.files[0] : null;
      setValues({ ...values, [e.target.name]: val });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  const onClear = () => {
    setValues(initialState);
  };

  return [values, onChange, onSubmit, onClear];
};

export const useGetPosts = (userId) => {
  const { token } = useContext(AuthContext);
  const { height, scrollY, scrollHeight } = useContext(DimensionContext);
  const { addMessage } = useContext(MessageContext);

  const [postsOffset, setOffset] = useState(0);
  const [dataComplete, setDataComplete] = useState(false);
  const [error, setError] = useState();

  const client = useApolloClient();

  const { loading, data, fetchMore, refetch, subscribeToMore } = useQuery(
    FETCH_POSTS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data.getPosts.length === postsOffset || data.getPosts.length < 10)
          setDataComplete(true);
      },
      variables: { userId: userId },
    }
  );

  let posts = [];
  if (data && data.getPosts) posts = data.getPosts;

  useEffect(() => {
    postsOffset !== posts.length && setOffset(posts.length);
  }, [posts, data]);

  useEffect(() => {
    //56px - Loader size
    if (
      height + scrollY + 56 >= scrollHeight &&
      !loading &&
      !dataComplete &&
      postsOffset !== 0
    ) {
      fetchMore({ variables: { offset: postsOffset } });
    }
  }, [height, scrollY, scrollHeight]);

  const setErrorHandler = (message) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const subscribeToNewPost = () => {
    subscribeToMore({
      document: ON_NEW_POST,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return { getPosts: [] };
        const newPost = subscriptionData.data.newPost;
        return { getPosts: [newPost] };
      },
    });
  };

  const subscribeToEditPost = () => {
    subscribeToMore({
      document: ON_EDIT_POST,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return { getPosts: [] };
        const editedPost = subscriptionData.data.editedPost;

        if (prev.getPosts.findIndex((pst) => pst.id === editedPost.id) === -1)
          return prev;

        return { getPosts: [editedPost] };
      },
    });
  };

  const subscribeToDeletePost = () => {
    subscribeToMore({
      document: ON_DEL_POST,
      updateQuery: (prev, { subscriptionData }) => {
        if (subscriptionData) {
          const postId = subscriptionData.data.deletedPost;
          let postKey;
          for (let key in client.cache.data.data) {
            if (client.cache.data.data[key].id === postId) postKey = key;
          }
          client.cache.data.delete(postKey);
        }

        return { getPosts: [] };
      },
    });
  };

  useEffect(() => {
    subscribeToNewPost();
    subscribeToEditPost();
    subscribeToDeletePost();
  }, []);

  return {
    isAuth: !!token,
    error,
    loading,
    setError: setErrorHandler,
    posts,
    dataComplete,
    refetch,
  };
};
