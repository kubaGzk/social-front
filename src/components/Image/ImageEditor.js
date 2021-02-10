import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

import { Modal, Button, Header, Grid } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";

const ImageEditor = (props) => {
  const { image, showModal, setShowModal, changeValue } = props;

  const [imageZoom, setImageZoom] = useState(1);

  let editorRef;

  const sliderSett = {
    start: 1,
    min: 1,
    max: 2,
    step: 0.25,
    onChange: (value) => setImageZoom(value),
  };

  const closeModal = () => {
    document.getElementById("avatar-image-select").value = "";
    changeValue({ target: { files: [], name: "image" } });
    setShowModal(false);
  };

  const confirmImage = () => {
    setShowModal(false);

    if (editorRef) {
      editorRef.getImage().toBlob((blob) => {
        const file = new File([blob], "upload_avatar", {
          lastModified: new Date(),
        });

        changeValue({ target: { files: [file], name: "image" } });
      });
    }
  };

  return (
    <Modal onClose={closeModal} open={showModal && image ? true : false}>
      <Modal.Header>Edit your avatar</Modal.Header>
      <Modal.Content>
        <Grid columns={2} divided stackable>
          <Grid.Row>
            <Grid.Column>
              <AvatarEditor
                ref={(editor) => (editorRef = editor)}
                image={image}
                width={200}
                height={200}
                scale={imageZoom}
              />
            </Grid.Column>
            <Grid.Column>
              <Header>Adjust profile to your needs</Header>
              <Slider
                style={{ maxWidth: "200px" }}
                value={imageZoom}
                settings={sliderSett}
                color="teal"
              />

              <p style={{ marginTop: "20px" }}>Is the photo ok?</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Modal.Description style={{ padding: "1em" }}></Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          content="Yep, that's fine"
          labelPosition="right"
          icon="checkmark"
          onClick={confirmImage}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ImageEditor;
