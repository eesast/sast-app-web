import React from "react";
import { shallow } from "enzyme";
import MainPage from "./MainPage";

it("renders without crashing", () => {
  shallow(<MainPage />);
});
