import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { AuthProvider, AuthConsumer } from "./AuthContext";

it("renders without crashing", () => {
  mount(
    <MemoryRouter>
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
                      logout
                    </button>
                  </div>
                )}
              </AuthConsumer>
            </div>
          </div>
        </div>
      </AuthProvider>
    </MemoryRouter>
  );
});
