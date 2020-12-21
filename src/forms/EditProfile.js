import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form, Item } from "semantic-ui-react";
import { CREATE_INVITE } from "../util/graphql";
import { useForm } from "../util/hooks";

const EditProfile = (props) => {
  const { firstname, lastname, image, id, description, setEditMode } = props;

  const [values, onChange, onSubmit] = useForm(() => {}, {
    firstname,
    lastname,
    image: "",
    description: description || "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [updateUser, { loading }] = useMutation(CREATE_INVITE, {
    update(_, {}) {},
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const selectImage = (e) => {
    onChange(e);
    setShowModal(true);
  };

  return (
    <>
      <Item.Image
        src={process.env.REACT_APP_IMAGES_URL + "/" + image}
        size="small"
      />
      <Item.Content>
        <Form noValidate>
          <Form.Input
            label="First name"
            placeholder="Firstname..."
            name="firstname"
            value={values.firstname}
            onChange={onChange}
            error={errors.firstname ? true : false}
            type="text"
          />

          <Form.Input
            label="Last name"
            placeholder="Lastname..."
            name="lastname"
            value={values.lastname}
            onChange={onChange}
            error={errors.lastname ? true : false}
            type="text"
          />

          <Form.TextArea
            label="Description"
            placeholder="Description..."
            name="description"
            value={values.description}
            onChange={onChange}
            error={errors.description ? true : false}
            type="text"
          />

          <Form.Input
            label="Change profile Image"
            name="image"
            id="avatar-image-select"
            onChange={selectImage}
            error={errors.image ? true : false}
            type="file"
            accept="image/*"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: " nowrap",
            }}
          />
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
        <Item.Extra>
          <Button.Group floated="right">
            <Button
              positive
              onClick={() => {
                console.log("SAVING");
              }}
            >
              Save changes
            </Button>
            <Button.Or />
            <Button negative onClick={() => setEditMode(false)}>
              Revert changes
            </Button>
          </Button.Group>
        </Item.Extra>
      </Item.Content>
    </>
  );
};

export default EditProfile;
