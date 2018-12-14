import React from "react";
import { shallow } from "enzyme";
import RegisterPage from "./RegisterPage";

it("renders without crashing", () => {
  shallow(<RegisterPage />);
});
