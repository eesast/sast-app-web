import { shallow } from "enzyme";
import React from "react";
import { AuthConsumer, AuthProvider } from "../AuthContext/AuthContext";
import ManagePage from "./ManagePage";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>{value => <ManagePage />}</AuthConsumer>
    </AuthProvider>
  );
});
