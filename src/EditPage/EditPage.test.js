import React from "react";
import { shallow } from "enzyme";
import EditPage from "./EditPage";

it("renders without crashing", () => {
  shallow(<EditPage />);
});
