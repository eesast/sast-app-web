import { shallow } from "enzyme";
import React from "react";
import { AuthConsumer, AuthProvider } from "../AuthContext/AuthContext";
import AppHeader from "./AppHeader";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>{value => <AppHeader />}</AuthConsumer>
    </AuthProvider>
  );
});
