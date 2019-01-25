import { shallow } from "enzyme";
import React from "react";
import { AuthConsumer, AuthProvider } from "../AuthContext/AuthContext";
import ResourceItemPage from "./ResourceItemPage";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AuthConsumer>{value => <ResourceItemPage />}</AuthConsumer>
    </AuthProvider>
  );
});
