import React from "react";
import { shallow } from "enzyme";
import AppHeader from "./AppHeader";
import { AuthProvider, AuthConsumer } from "../AuthContext/AuthContext";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>
        <AppHeader />
      </AuthConsumer>
    </AuthProvider>
  );
});
