import { useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  // consts for reducer
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function reducer(state, action) {
    if (action.type === SET_DAY) {
      return {...state, day: action.day}
    }
    if (action.type === SET_APPLICATION_DATA) {
      return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers}
    }
    if (action.type === SET_INTERVIEW) {
      return {...state, appointments: action.appointments, interview: action.interview }
    }
    return state;
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
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    })
    .catch(error => console.log(error));
  }, []);

  function bookInterview(id, interview, changeSpots) {
    //update spots
    if (changeSpots) {
      for (let day of [...state.days]) {
        if (day.appointments.includes(id)) {
          day.spots -= 1;
        }
      }
    }

    // add interview info to db
    return axios({
      method: "PUT",
      url: `/api/appointments/${id}`,
      data: { interview }
    })
    .then(response => {

      const appointment = {
        ...state.appointments[id],
        interview: {...interview }
      }

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      dispatch({ type: SET_INTERVIEW,
        appointments,
        interview: response.data
      });
    })
  };

  function deleteInterview(id, interview) {
    // add in to satisfy reducer
    const appointments = state.appointments;

    // update spots
    for (let day of [...state.days]) {
      if (day.appointments.includes(id)) {
        day.spots += 1
      }
    };

    return axios({
      method: "DELETE",
      url: `/api/appointments/${id}`
    })
    .then(response =>
      dispatch({
        type: SET_INTERVIEW,
        interview: null,
        appointments
      })
    )
  };

  return { state, setDay, bookInterview, deleteInterview }
}