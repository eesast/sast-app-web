import { shallow } from "enzyme";
import React from "react";
import CommentEditCard from "./CommentEditCard";

it("renders without crashing", () => {
  shallow(<CommentEditCard articleId={1} replyTo={-1} />);
});
