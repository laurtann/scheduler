import { useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  // consts for reducer
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const BOOK_INTERVIEW = "BOOK_INTERVIEW";
  const DELETE_INTERVIEW = "DELETE_INTERVIEW";
  const SET_DAYS_DATA = "SET_DAYS_DATA";

  // initialize reducer
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
    // update state from days/appts/interviewers get req
    if (action.type === SET_APPLICATION_DATA) {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    }
    // update state for spots
    if (action.type === SET_DAYS_DATA) {
      return {
        ...state,
        days: action.days,
      }
    }
    // update state for appt handling
    if (action.type === BOOK_INTERVIEW || action.type === DELETE_INTERVIEW || action.type === SET_INTERVIEW) {
      const appointment = {
        ...state.appointments[action.appointmentId],
        interview: action.interview ? {...action.interview } : null
      };

      const appointments = {
        ...state.appointments,
        [action.appointmentId]: appointment
      };

      // function to update spots
      refreshDaysData();

      return {
        ...state,
        appointments,
      }
    }

    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }

  const setDay = day => dispatch({ type: SET_DAY, day });

  // get request days/appts/interviewers DB
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
        })
      }
    }
    // close connection
    return function cleanup() {
      ws.close();
    }
  }, []);

  // if need to change spots in future, do it here
  // recalc spots - go to each day and calc how many days null
  // do it without mutating state
  // function to update spots
  function refreshDaysData() {
    axios.get(`/api/days`)
    .then(response => {
      dispatch({
        type: SET_DAYS_DATA,
        days: response.data,
      })
    })
  }

  function bookInterview(id, interview) {
    // add interview info to db
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(response => {
      dispatch({
        type: BOOK_INTERVIEW,
        interview,
        appointmentId: id
      });
    })
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
    )
  };

  return { state, setDay, bookInterview, deleteInterview }
}