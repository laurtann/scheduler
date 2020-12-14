import { useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  // consts for reducer
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const BOOK_INTERVIEW = "BOOK_INTERVIEW";
  const DELETE_INTERVIEW = "DELETE_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function reducer(state, action) {
    if (action.type === SET_DAY) {
      return {
        ...state,
        day: action.day
      }
    }
    if (action.type === SET_APPLICATION_DATA) {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    }
    if (action.type === BOOK_INTERVIEW) {
      return {
        ...state,
        appointments: action.appointments,
        interview: action.interview
      }
    }
    if (action.type === DELETE_INTERVIEW) {
      return {
        ...state,
        interview: action.interview
      }
    }
    if (action.type === SET_INTERVIEW) {
      const appointment = {
        ...state.appointments[action.id],
        interview: {...action.interview }
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      return {
        ...state,
        appointments: appointments,
        interview: action.interview
      }
    }
    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  // request all APIs
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ])
    .then(([days, appointments, interviewers]) => {
      // console.log("DAYS", days.data, "APPTS", appointments.data, "INTS", interviewers.data);
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    })
    .catch(error => console.log(error));

    // WEBSOCKETS IP
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    // message to server
    ws.onopen = function (event) {
      ws.send("ping");
    };
    //message from server
    ws.onmessage = function (event) {
      const message = JSON.parse(event.data);

      if (message.type === "SET_INTERVIEW") {
        dispatch({
          type: SET_INTERVIEW,
          id: message.id,
          interview: message.interview
        })
      }
    }
    // close connection
    return function cleanup() {
      ws.close();
    }
  }, [state.days]);

  function bookInterview(id, interview, changeSpots) {

    // add interview info to db
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(response => {

      const appointment = {
        ...state.appointments[id],
        interview: {...interview }
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      dispatch({
        type: BOOK_INTERVIEW,
        appointments,
        interview: response.data
      });
    })
    .then(() => {
      return axios.get(`/api/days`)
    })
    .then(res => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: res.data,
        appointments: state.appointments,
        interviewers: state.interviewers
      })
    })
  };

  function deleteInterview(id, interview) {

    return axios.delete(`/api/appointments/${id}`)
    .then(response =>
      dispatch({
        type: DELETE_INTERVIEW,
        interview: null,
      })
    )
    .then(() => {
      return axios.get(`/api/days`)
    })
    .then(res => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: res.data,
        appointments: state.appointments,
        interviewers: state.interviewers
      })
    })
  };

  return { state, setDay, bookInterview, deleteInterview }
}