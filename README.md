# Interview Scheduler

Scheduler is a single page app designed for students to book an interview with an instructor. Users can create, edit and delete appointments, and receive an appropriate message if an error occurs.

This app was built using React, Webpack, Babel, Axios and WebSockets. It was tested using Storybook, Jest, Webpack Dev Server and the React Testing Library. This project was created as part of Lighthouse Lab's Web Development Bootcamp over weeks 7 and 8.

## Screenshots
!["Book New Appointment View"](https://github.com/laurtann/scheduler/blob/master/docs/scheduler-book-interview-form.png?raw=true)
!["View of Booked Appointment"](https://github.com/laurtann/scheduler/blob/master/docs/scheduler-interview-booked.png?raw=true)
!["Delete Interview Confirmation"](https://github.com/laurtann/scheduler/blob/master/docs/scheduler-confirm-delete.png?raw=true)
!["On Save & On Delete Error Messages"](https://github.com/laurtann/scheduler/blob/master/docs/scheduler-error-messages.png?raw=true)
!["Multi-window with WebSockets"](https://github.com/laurtann/scheduler/blob/master/docs/scheduler-web-sockets.gif?raw=true)

## Setup

Install dependencies with `npm install`.

Uses database information from https://github.com/laurtann/scheduler-api. Server must be running using npm start.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
