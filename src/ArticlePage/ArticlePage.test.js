import React from "react";
import { mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import DocumentTitle from "react-document-title";
import ArticlePage from "./ArticlePage";

it("renders without crashing", () => {
  const page = mount(
    <MemoryRouter initialEntries={["/articles/tensorflow-first-look"]}>
      <Route path="/articles/:alias" component={ArticlePage} />
    </MemoryRouter>
  );
  const documentTitle = page.find(DocumentTitle);
  expect(documentTitle.props().title).toEqual("tensorflow-first-look");
});
