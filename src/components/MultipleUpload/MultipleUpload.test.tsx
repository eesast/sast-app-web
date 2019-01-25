import { shallow } from "enzyme";
import React from "react";
import MultipleUpload from "./MultipleUpload";

it("renders without crashing", () => {
  shallow(
    // tslint:disable: jsx-no-lambda no-empty
    <MultipleUpload
      handleFileListChange={() => {}}
      handleRemove={() => false}
    />
  );
});
