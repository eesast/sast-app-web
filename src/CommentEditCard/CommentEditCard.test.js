import React from "react";
import { shallow } from "enzyme";
import CommentEditCard from "./CommentEditCard";

it("renders without crashing", () => {
  shallow(<CommentEditCard />);
});
