import { shallow } from "enzyme";
import React from "react";
import PreviewPage from "./PreviewPage";

it("renders without crashing", () => {
  shallow(<PreviewPage />);
});
