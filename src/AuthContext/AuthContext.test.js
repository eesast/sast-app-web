import React from "react";
import { mount } from "enzyme";
import { AuthProvider, AuthConsumer } from "./AuthContext";

it("renders without crashing", () => {
  const wrapper = mount(
    <AuthProvider>
      <div>
        <div>
          <div>
            <AuthConsumer>
              {({ auth, token, login, logout }) => (
                <div>
                  <button className="login" onClick={login}>
                    login
                  </button>
                  <button className="logout" onClick={logout}>
                    login
                  </button>
                </div>
              )}
            </AuthConsumer>
          </div>
        </div>
      </div>
    </AuthProvider>
  );

  expect(wrapper.state("auth")).toBe(false);
  wrapper.find(".login").simulate("click");
  expect(wrapper.state("auth")).toBe(true);
  wrapper.find(".logout").simulate("click");
  expect(wrapper.state("auth")).toBe(false);
});
