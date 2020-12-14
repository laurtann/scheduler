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
    if (action.type === SET_DAYS_DATA) {
      return {
        ...state,
        days: action.days,
      }
    }
    if (action.type === BOOK_INTERVIEW || action.type === DELETE_INTERVIEW || action.type === SET_INTERVIEW) {
      // console.log("ACTION", action);
      const appointment = {
        ...state.appointments[action.appointmentId],
        interview: action.interview ? {...action.interview } : null
      };

      const appointments = {
        ...state.appointments,
        [action.appointmentId]: appointment
      };

      refreshDaysData();


      return {
        ...state,
        appointments,
      }
    }
    // if (action.type === DELETE_INTERVIEW) {
    //   return {
    //     ...state,
    //     interview: action.interview
    //   }
    // }
    // if (action.type === SET_INTERVIEW) {
    //   const appointment = {
    //     ...state.appointments[action.id],
    //     interview: {...action.interview }
    //   };

      // const appointments = {
      //   ...state.appointments,
      //   [action.id]: appointment
      // };

      // return {
      //   ...state,
      //   appointments: appointments,
      //   interview: action.interview
    //   // }
    // }
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
  }, []);

  useEffect(() => {
    // WebSocket Connection
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

    return axios.delete(`/api/appointments/${id}`)
    .then(response =>
      dispatch({
        type: DELETE_INTERVIEW,
        interview: null,
        appointmentId: id
      })
    )
  };

  function refreshDaysData() {
    axios.get(`/api/days`)
    .then(response => {
      dispatch({
        type: SET_DAYS_DATA,
        days: response.data,
      })
    })
  }

  return { state, setDay, bookInterview, deleteInterview }
}