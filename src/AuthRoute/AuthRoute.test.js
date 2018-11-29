import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../AuthContext/AuthContext";
import AuthRoute from "./AuthRoute";

it("goes to login page when not authed", () => {
  const wrapper = mount(
    <AuthProvider>
      <MemoryRouter initialEntries={["/protected"]}>
        <AuthRoute path="/protected" component={<div>logged in</div>} />
      </MemoryRouter>
    </AuthProvider>
  );

  wrapper.setState({ auth: false });
  expect(wrapper.find("Router").prop("history").location.pathname).toBe(
    "/login"
  );
});
