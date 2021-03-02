import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";

import { AuthContext } from "../../../context/auth";
import { DimensionContext } from "../../../context/dimension";
import {
  CONFIRM_INVITE,
  DECLINE_INVITE,
  FETCH_INVITES,
} from "../../../util/graphql";

import { Loader } from "semantic-ui-react";
import Invites from "../../../components/Invites/Invites";
import InviteItems from "../../../components/Invites/InviteItems";

const mocks = [
  {
    request: { query: FETCH_INVITES },
    result: {
      data: {
        getInvitations: {
          received: [
            {
              firstname: "u2",
              lastname: "u2",
              image: "image",
              id: "u2",
            },
          ],
          sent: [
            {
              firstname: "u3",
              lastname: "u3",
              image: "image",
              id: "u3",
            },
          ],
        },
      },
    },
  },
  {
    request: { query: FETCH_INVITES },
    result: {
      data: {
        getInvitations: {
          received: [
            {
              firstname: "u2",
              lastname: "u2",
              image: "image",
              id: "u2",
            },
          ],
          sent: [
            {
              firstname: "u3",
              lastname: "u3",
              image: "image",
              id: "u3",
            },
          ],
        },
      },
    },
  },
  {
    request: { query: FETCH_INVITES },
    result: {
      data: {
        getInvitations: {
          received: [
            {
              firstname: "u2",
              lastname: "u2",
              image: "image",
              id: "u2",
            },
          ],
          sent: [
            {
              firstname: "u3",
              lastname: "u3",
              image: "image",
              id: "u3",
            },
          ],
        },
      },
    },
  },
  {
    request: { query: CONFIRM_INVITE },
    result: {
      data: {
        confirmInvite: {
          message: "",
          id: "i1",
        },
      },
    },
  },
  {
    request: { query: DECLINE_INVITE },
    result: {
      data: {
        declineInvite: {
          message: "",
          id: "i1",
        },
      },
    },
  },
];

describe("<Invites />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ userId: "u1" }}>
          <DimensionContext.Provider value={{ width: "800" }}>
            <BrowserRouter>
              <Invites />
            </BrowserRouter>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it("Renders with Loader", () => {
    expect(wrapper.find(Loader)).toHaveLength(1);
  });

  it("Renders without Loader", async () => {
    await act(async () => {
      await new Promise((res) => setTimeout(res, 0));
      wrapper.update();
    });
    expect(wrapper.find(Loader)).toHaveLength(0);
    expect(wrapper.find(InviteItems)).toHaveLength(2);
  });
});
