import React from "react";
import { shallow } from "enzyme";
import MultipleUpload from "./MultipleUpload";

it("renders without crashing", () => {
  shallow(<MultipleUpload />);
});
