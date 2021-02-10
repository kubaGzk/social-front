import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../context/auth";
import { DimensionContext } from "../context/dimension";
import { UPDATE_USER } from "../util/graphql";
import { useForm } from "../util/hooks";

import { Button, Form, Item } from "semantic-ui-react";
import ImageEditor from "../components/Image/ImageEditor";

const EditProfile = (props) => {
  const {
    firstname,
    lastname,
    image,
    description,
    setEditMode,
    refetchUser,
    refetchPosts,
  } = props;

  const { updateUserData } = useContext(AuthContext);
  const { width } = useContext(DimensionContext);

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [values, onChange, onSubmit] = useForm(updateHandler, {
    firstname,
    lastname,
    image: "",
    description: description || "",
  });


  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    update(
      _,
      {
        data: {
          updateUser: { firstname, lastname, image },
        },
      }
    ) {
      refetchUser();
      refetchPosts();
      updateUserData(firstname, lastname, image);
      setEditMode(false);
    },
    onError({ graphQLErrors, networkError }) {
      console.log(graphQLErrors, networkError);

      graphQLErrors[0] &&
        setErrors(graphQLErrors[0].extensions.exception.errors);

      networkError && setErrors({ general: "Unexpected network error" });
    },
    variables: values,
  });

  function updateHandler() {
    updateUser();
  }

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
        <Form noValidate className={loading ? "loading" : ""}>
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
        <ImageEditor
          showModal={showModal}
          setShowModal={setShowModal}
          image={values.image}
          changeValue={onChange}
        />
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
          <Button.Group floated="right" size={width <= 768 ? "tiny" : "medium"}>
            <Button positive onClick={onSubmit}>
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
