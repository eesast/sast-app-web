import React from "react";
import { shallow } from "enzyme";
import CommentCard from "./CommentCard";

it("renders without crashing", () => {
  shallow(
    <CommentCard
      comment={{
        id: 1,
        likers: [],
        authorId: 2016011000,
        author: "test",
        articleId: 1,
        content: "test",
        replyTo: -1
      }}
    />
  );
});
