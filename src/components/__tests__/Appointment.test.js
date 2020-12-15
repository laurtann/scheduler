import React from "react";
import { render, cleanup } from "@testing-library/react";
import Application from "components/Application";
import Appointment from "components/appointment/index"

afterEach(cleanup);

it("renders without crashing", () => {
  render(<Application />);
});

describe("Appointment", () => {
  it("renders without crashing", () => {
    render(<Appointment />);
  });
});