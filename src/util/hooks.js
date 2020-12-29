import { useQuery } from "@apollo/client";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/auth";
import { DimensionContext } from "../context/dimension";
import { FETCH_POSTS_QUERY } from "./graphql";

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

  const [postsOffset, setOffset] = useState(0);
  const [dataComplete, setDataComplete] = useState(false);
  const [error, setError] = useState();

  const { loading, data, fetchMore, client, refetch } = useQuery(
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
