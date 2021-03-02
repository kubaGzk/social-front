import React from "react";
import { shallow } from "enzyme";

import Likes from "../../../components/Post/Likes";

describe("<Likes />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <Likes
        likes={[
          { id: "l1", firstname: "u1", lastname: "u1" },
          { id: "l2", firstname: "u2", lastname: "u2" },
        ]}
      />
    );
  });

  it("Renders two likes", () => {
    expect(wrapper.find("p")).toHaveLength(2);
  });

  it("Renders 10 likes plus dots when exceeding limit", () => {
    wrapper = shallow(
      <Likes
        likes={[
          { id: "l1", firstname: "u1", lastname: "u1" },
          { id: "l2", firstname: "u2", lastname: "u2" },
          { id: "l3", firstname: "u3", lastname: "u3" },
          { id: "l4", firstname: "u4", lastname: "u4" },
          { id: "l5", firstname: "u5", lastname: "u5" },
          { id: "l6", firstname: "u6", lastname: "u6" },
          { id: "l7", firstname: "u7", lastname: "u7" },
          { id: "l8", firstname: "u8", lastname: "u8" },
          { id: "l9", firstname: "u9", lastname: "u9" },
          { id: "l10", firstname: "u10", lastname: "u10" },
          { id: "l11", firstname: "u11", lastname: "u11" },
          { id: "l12", firstname: "u12", lastname: "u12" },
          { id: "l13", firstname: "u13", lastname: "u13" },
        ]}
      />
    );

    expect(wrapper.find("p")).toHaveLength(11);
  });

  it("Renders no likes", () => {
    wrapper = shallow(<Likes likes={[]} />);
    expect(wrapper.text("No likes"));
  });
});
