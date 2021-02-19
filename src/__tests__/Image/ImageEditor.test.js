import React from "react";
import { shallow } from "enzyme";
import ImageEditor from "../../components/Image/ImageEditor";
import AvatarEditor from "react-avatar-editor";
import { Button } from "semantic-ui-react";

describe("<ImageEditor />", () => {
  let wrapper;

  const setShowModal = jest.fn();
  const changeValue = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <ImageEditor
        showModal={true}
        image={new File(["123"], "file.jpg", { type: "image/jpeg" })}
        setShowModal={setShowModal}
        changeValue={changeValue}
      />
    );
  });

  it("Render AvatarEditor", () => {
    expect(wrapper.find(AvatarEditor)).toHaveLength(1);
  });

  it("Render Buttons", () => {
    expect(
      wrapper.find({ content: "Yep, that's fine" }).find(Button)
    ).toHaveLength(1);
    expect(wrapper.find({ content: "Cancel" }).find(Button)).toHaveLength(1);
  });

  it("Simulate Yep Button click", () => {
    wrapper
      .find({ content: "Yep, that's fine" })
      .find(Button)
      .simulate("click");
    expect(setShowModal).toBeCalled();
  });

});
