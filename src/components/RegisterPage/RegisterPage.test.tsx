import { shallow } from "enzyme";
import React from "react";
import RegisterPage from "./RegisterPage";

it("renders without crashing", () => {
  shallow(<RegisterPage />);
});
