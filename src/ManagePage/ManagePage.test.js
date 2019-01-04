import React from "react";
import { shallow } from "enzyme";
import ManagePage from "./ManagePage";

it("renders without crashing", () => {
  shallow(<ManagePage />);
});
