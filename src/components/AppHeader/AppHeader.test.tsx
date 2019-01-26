import { shallow } from "enzyme";
import React from "react";
import { AuthProvider } from "../AuthContext/AuthContext";
import AppHeader from "./AppHeader";

it("renders without crashing", () => {
  shallow(
    <AuthProvider>
      <AppHeader />
    </AuthProvider>
  );
});
