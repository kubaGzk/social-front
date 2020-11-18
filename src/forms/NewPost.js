import { gql, useMutation } from "@apollo/react-hooks";
import React, { useRef, useState } from "react";
import { Card, Form, Grid, TextArea, Input, Ref } from "semantic-ui-react";
import { useForm } from "../util/hooks";

const INITIAL_STATE = { body: "", image: null };

const NewPost = (props) => {
  const [values, onChange, onSubmit, onClear] = useForm(
    submitPostHandler,
    INITIAL_STATE
  );

  const [error, setError] = useState();

  const [submitPost, { loading }] = useMutation(CREATE_POST, {
    update(_, { data: { createPost: postData } }) {
      
      onClear();
      document.getElementById("file-uploader").value = "";

      props.setPosts([postData, ...props.posts]);
    },
    onError(err) {
      console.log(err.graphQLErrors[0].message);
      setError(err.graphQLErrors[0].message);
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

const CREATE_POST = gql`
  mutation createPost($body: String!, $image: Upload, $type: PostType!) {
    createPost(body: $body, image: $image, type: $type) {
      id
      body
      createdAt
      userId
      likeCount
      commentCount
      type
      image
      firstname
      lastname
      userImage
    }
  }
`;

export default NewPost;
