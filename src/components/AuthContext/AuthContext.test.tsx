import { mount } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AuthConsumer, AuthProvider } from "./AuthContext";

it("renders without crashing", () => {
  const wrapper = mount(
    <MemoryRouter>
      <AuthProvider>
        <div>
          <div>
            <div>
              <AuthConsumer>
                {({ userInfo, login, logout, checkTokenStatus }) => (
                  <div>
                    <p>{JSON.stringify(userInfo)}</p>
                    <button
                      className="login"
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => login("username", "password")}
                    >
                      login
                    </button>
                    <button className="logout" onClick={logout}>
                      logout
                    </button>
                    <button
                      className="checkTokenStatus"
                      // tslint:disable-next-line: jsx-no-lambda
                      onClick={() => checkTokenStatus()}
                    >
                      checkTokenStatus
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

  wrapper.find(".checkTokenStatus").simulate("click");
  wrapper.find(".login").simulate("click");
  wrapper.find(".checkTokenStatus").simulate("click");
  wrapper.find(".logout").simulate("click");
  wrapper.find(".checkTokenStatus").simulate("click");

  wrapper.childAt(0).setState({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAxNjAxMTA5NywidXNlcm5hbWUiOiJ5aW5ncnVpMjA1IiwibmFtZSI6IuW6lOedvyIsImVtYWlsIjoieWluZ3J1aTIwNUBxcS5jb20iLCJncm91cCI6ImFkbWluIiwicm9sZSI6InJvb3QiLCJpYXQiOjE1NDgzMzg5NDUsImV4cCI6MTU0ODM4MjE0NX0.TxQSnBlXMgGEPv-Ut24EM7U6ydNQ_SDZNY2ZaHUGfd8"
  });
  wrapper.find(".checkTokenStatus").simulate("click");
});
