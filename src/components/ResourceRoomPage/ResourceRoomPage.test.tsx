import { shallow } from "enzyme";
import React from "react";
import ResourceRoomPage from "./ResourceRoomPage";

it("renders without crashing", () => {
  shallow(<ResourceRoomPage />);
});
