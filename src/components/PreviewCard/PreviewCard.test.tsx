import { shallow } from "enzyme";
import React from "react";
import PreviewCard from "./PreviewCard";

it("renders without crashing", () => {
  shallow(<PreviewCard loading={false} title="test" />);
});
