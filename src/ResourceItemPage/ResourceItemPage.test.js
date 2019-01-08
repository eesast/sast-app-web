import React from "react";
import { shallow } from "enzyme";
import ResourceItemPage from "./ResourceItemPage";
import { AuthProvider, AuthConsumer } from "../AuthContext/AuthContext";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>
        <ResourceItemPage />
      </AuthConsumer>
    </AuthProvider>
  );
});
