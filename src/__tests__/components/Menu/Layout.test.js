import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";

import { AuthContext } from "../../../context/auth";
import { DimensionContext } from "../../../context/dimension";
import { MessageContext } from "../../../context/message";
import { ON_INVITE } from "../../../util/graphql";

import {  Sidebar } from "semantic-ui-react";
import Layout from "../../../components/Menu/Layout";
import MenuBar from "../../../components/Menu/MenuBar";
import ChatContainer from "../../../components/Chat/ChatContainer";

const mocks = [{ request: { query: ON_INVITE } }];

describe("<Layout />", () => {
  const addMessage = jest.fn();

  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{
            token: "token",
            image: "image",
            firstname: "u1",
            lastname: "u1",
            userId: "u1",
            email: "u1",
            error: null,
            loading: false,
          }}
        >
          <DimensionContext.Provider value={{ width: 800 }}>
            <MessageContext.Provider
              value={{ addMessage: addMessage, messages: [] }}
            >
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </MessageContext.Provider>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );
  });

  it("Renders MenuBar, Sidebar and Chat if token exist", () => {
    expect(wrapper.find(Sidebar)).toHaveLength(1);
    expect(wrapper.find(MenuBar)).toHaveLength(1);
    expect(wrapper.find(ChatContainer)).toHaveLength(1);
  });

  it("Renders no chat without token", () => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AuthContext.Provider
          value={{
            token: null,
            image: "image",
            firstname: "u1",
            lastname: "u1",
            userId: "u1",
            email: "u1",
            error: null,
            loading: false,
          }}
        >
          <DimensionContext.Provider value={{ width: 800 }}>
            <MessageContext.Provider
              value={{ addMessage: addMessage, messages: [] }}
            >
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </MessageContext.Provider>
          </DimensionContext.Provider>
        </AuthContext.Provider>
      </MockedProvider>
    );

    expect(wrapper.find(ChatContainer)).toHaveLength(0);
  });
});
