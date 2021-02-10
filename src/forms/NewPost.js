import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { CREATE_POST, FETCH_POSTS_QUERY } from "../util/graphql";
import { useForm } from "../util/hooks";

import { Card, Form, Grid, TextArea, Input } from "semantic-ui-react";

const INITIAL_STATE = { body: "", image: null };

const NewPost = (props) => {
  
  const [error, setError] = useState();

  const [values, onChange, onSubmit, onClear] = useForm(
    submitPostHandler,
    INITIAL_STATE
  );

  const [submitPost, { loading }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost: postData } }) {
      //CLEANING FORM
      onClear();
      document.getElementById("file-uploader").value = "";

      const data = cache.readQuery({ query: FETCH_POSTS_QUERY });

      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [postData] },
      });
    },
    onError(err) {
      let errMsg = "Unexpected error";
      if (err && err.graphQLErrors[0] && err.graphQLErrors[0].message)
        errMsg = err.graphQLErrors[0].message;

      console.log(errMsg, err);

      setError(errMsg);
      setTimeout(() => {
        setError(null);
      }, 5000);
    },
  });

  function submitPostHandler() {
    if (values.image) {
      submitPost({ variables: { ...values, type: "IMAGE" } });
    } else {
      submitPost({ variables: { ...values, type: "TEXT" } });
    }
  }

  return (
    <Grid.Row className="post-add">
      <Card fluid>
        <Card.Content>
          <Form onSubmit={onSubmit} loading={loading}>
            <Form.Input
              name="body"
              control={TextArea}
              label="Add new post"
              placeholder="What you are thinking about..."
              style={{ resize: "none" }}
              onChange={onChange}
              value={values.body}
            />
            <Form.Group inline className={"post-add-buttons"}>
              <Form.Input
                size="mini"
                control={Input}
                name="image"
                label="Add image"
                type="file"
                accept="image/*"
                onChange={onChange}
                id="file-uploader"
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: " nowrap",
                }}
              />

              <Form.Button content="Publish" type="submit" color="teal" />
            </Form.Group>
          </Form>
          {error && <div className="ui error message">{error}</div>}
        </Card.Content>
      </Card>
    </Grid.Row>
  );
};

export default NewPost;
