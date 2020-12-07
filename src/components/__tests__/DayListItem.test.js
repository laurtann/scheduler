
×
Congrats on completing activity 'Styling the DayListItem'!
Testing the DayListItem
Interview Scheduler Assignment
30 minutes
 Status
Incomplete
We've created our DayListItems and added the appropriate styles to them based on a set of props. However, we just noticed something is off. Right now the spots remaining are only showing up as a number and that doesn't match our design.

We are going to use a Test Driven Development approach to update how the spots feature displays the remaining spots available.

Tests
We can use unit tests to ensure that the messaging is correct for our spots feature.

Create a DayListItem.test.js file in the src/components/__tests__/ folder. Copy and paste the tests into the file.

import React from "react";

import { render, cleanup } from "@testing-library/react";

import DayListItem from "components/DayListItem";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<DayListItem />);
});

it("renders 'no spots remaining' when there are 0 spots", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={0} />);
  expect(getByText("no spots remaining")).toBeInTheDocument();
});

it("renders '1 spot remaining' when there is 1 spot", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={1} />);
  expect(getByText("1 spot remaining")).toBeInTheDocument();
});

it("renders '2 spots remaining' when there are 2 spots", () => {
  const { getByText } = render(<DayListItem name="Monday" spots={2} />);
  expect(getByText("2 spots remaining")).toBeInTheDocument();
});