import { mount } from "enzyme";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { AuthProvider } from "../AuthContext/AuthContext";
import ArticlePage from "./ArticlePage";

it("renders without crashing", () => {
  mount(
    <AuthProvider>
      <MemoryRouter initialEntries={["/articles/tensorflow-first-look"]}>
        <Route path="/articles/:alias" component={ArticlePage} />
      </MemoryRouter>
    </AuthProvider>
  );
});
