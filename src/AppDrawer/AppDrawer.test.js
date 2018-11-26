import React from "react";
import { shallow } from "enzyme";
import AppDrawer from "./AppDrawer";

it("renders without crashing", () => {
  shallow(<AppDrawer />);
});
