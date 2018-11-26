import React from "react";
import { shallow } from "enzyme";
import PreviewCard from "./PreviewCard";

it("renders without crashing", () => {
  shallow(<PreviewCard />);
});
