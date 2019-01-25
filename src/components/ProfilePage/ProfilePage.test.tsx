import { shallow } from "enzyme";
import React from "react";
import ProfilePage from "./ProfilePage";

it("renders without crashing", () => {
  shallow(<ProfilePage />);
});
