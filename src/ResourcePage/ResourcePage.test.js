import React from "react";
import { shallow } from "enzyme";
import ResourcePage from "./ResourcePage";

it("renders without crashing", () => {
  shallow(<ResourcePage />);
});
