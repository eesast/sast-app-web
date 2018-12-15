import React from "react";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import ArticlePage from "./ArticlePage";

it("renders without crashing", () => {
  mount(
    <MemoryRouter initialEntries={["/articles/tensorflow-first-look"]}>
      <Route path="/articles/:alias" component={ArticlePage} />
    </MemoryRouter>
  );
});
