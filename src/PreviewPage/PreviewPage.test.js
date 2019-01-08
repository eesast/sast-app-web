import React from "react";
import { shallow } from "enzyme";
import PreviewPage from "./PreviewPage";

it("renders without crashing", () => {
  shallow(<PreviewPage />);
});
