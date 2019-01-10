import React from "react";
import { shallow } from "enzyme";
import ManagePage from "./ManagePage";
import { AuthProvider, AuthConsumer } from "../AuthContext/AuthContext";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>
        <ManagePage />
      </AuthConsumer>
    </AuthProvider>
  );
});
