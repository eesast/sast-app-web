import React from "react";
import { shallow } from "enzyme";
import ResourceRoomPage from "./ResourceRoomPage";

it("renders without crashing", () => {
  shallow(<ResourceRoomPage />);
});
