import { shallow } from "enzyme";
import React from "react";
import LoginPage from "./LoginPage";

it("renders without crashing", () => {
  shallow(<LoginPage />);
});
