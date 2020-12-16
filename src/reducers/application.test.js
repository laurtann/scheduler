import getReducer from "reducers/application";

// getReducer returns reducer func, so call it.
const reducer = getReducer();

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});