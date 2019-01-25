import { shallow } from "enzyme";
import React from "react";
import AppDrawer from "./AppDrawer";

it("renders without crashing", () => {
  shallow(<AppDrawer visible={true} />);
});
