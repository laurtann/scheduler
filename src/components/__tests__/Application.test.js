import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";
jest.mock('axios');

afterEach(cleanup);
describe("Application", () => {
  // test 1
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  // test 2
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

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  // test 3
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

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  // test 4
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // allows update of spots - adapted from https://jestjs.io/docs/en/manual-mocks
    require('axios').__setDaysFixture([
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 1
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: 1
      }
    ]);

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  // test 5
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error while Saving"));
    expect(getByText(appointment, "Error while Saving")).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));
    expect(getByText(appointment, "Save")).toBeInTheDocument();
  });

  // test 6
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error while Deleting"));
    expect(getByText(appointment, "Error while Deleting")).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));
    expect(queryByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });
});