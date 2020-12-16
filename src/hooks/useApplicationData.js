import { useReducer, useEffect } from "react";
import axios from 'axios';

import getReducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, BOOK_INTERVIEW, DELETE_INTERVIEW, SET_DAYS_DATA } from "../reducers/application"

export default function useApplicationData() {
  // initialize reducer & pass in refreshDaysData to getReducer from reducers/application.js
  const [state, dispatch] = useReducer(getReducer(refreshDaysData), {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  // get request days/appts/interviewers DB
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ])
      .then(([days, appointments, interviewers]) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data
        });
      })
      .catch(error => console.log(error));
  }, []);

  // WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    // test message to server
    ws.onopen = function (event) {
      ws.send("ping");
    };
    // message from server containing interview object
    ws.onmessage = function (event) {
      const message = JSON.parse(event.data);

      if (message.type === "SET_INTERVIEW") {
        dispatch({
          type: SET_INTERVIEW,
          appointmentId: message.id,
          interview: message.interview
        });
      }
    };
    // close connection
    return function cleanup() {
      ws.close();
    };
  }, []);

  // function to update spots
  function refreshDaysData() {
    axios.get(`/api/days`)
      .then(response => {
        dispatch({
          type: SET_DAYS_DATA,
          days: response.data,
        });
      });
  };

  function bookInterview(id, interview) {
    // add interview info to db
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        dispatch({
          type: BOOK_INTERVIEW,
          interview,
          appointmentId: id
        });
      });
  };

  function deleteInterview(id, interview) {
    // remove interview from db
    return axios.delete(`/api/appointments/${id}`)
      .then(response =>
        dispatch({
          type: DELETE_INTERVIEW,
          interview: null,
          appointmentId: id
        })
      );
  };

  return { state, setDay, bookInterview, deleteInterview };
}