import { shallow } from "enzyme";
import React from "react";
import EditPage from "./EditPage";

it("renders without crashing", () => {
  shallow(<EditPage />);
});
