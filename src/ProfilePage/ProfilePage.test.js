import React from "react";
import { shallow } from "enzyme";
import ProfilePage from "./ProfilePage";

it("renders without crashing", () => {
  shallow(<ProfilePage />);
});
