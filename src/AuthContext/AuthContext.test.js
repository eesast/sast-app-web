import React from "react";
import { mount } from "enzyme";
import { AuthProvider, AuthConsumer } from "./AuthContext";

it("renders without crashing", () => {
  mount(
    <AuthProvider>
      <div>
        <div>
          <div>
            <AuthConsumer>
              {({ isTokenValid, login, logout }) => (
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
});
