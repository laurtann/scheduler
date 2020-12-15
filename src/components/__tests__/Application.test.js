import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";
import Application from "components/Application";
jest.mock('axios');

afterEach(cleanup);
describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // allows update of spots - adapted from https://jestjs.io/docs/en/manual-mocks
    require('axios').__setDaysFixture([
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 0
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: 1
      }
    ]);
    //render app
    const { container } = render(<Application />);

    // wait for text
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // press add on empty
    fireEvent.click(getByAltText(appointment, "Add"));

    // change input val
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // click save
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // ensure saving msg displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // wait for show of new appt
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // ensure spots updated
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // allows update of spots - adapted from https://jestjs.io/docs/en/manual-mocks
    require('axios').__setDaysFixture([
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 2
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: 1
      }
    ]);
    // render app
    const { container } = render(<Application />);

    // wait for text to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // press delete on booked appt
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    //check for confirmation msg
    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    // check for "deleting" msg
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // check for return to "empty"
    await waitForElement(() => getByAltText(appointment, "Add"));

    // ensure that spots were updated
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
});