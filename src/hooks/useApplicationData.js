import React, { useState, useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
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

  // request all APIs
  useEffect(() => {
    Promise.all([
      axios({
        method: "GET",
        url: `/api/days`
      }),
      axios({
        method: "GET",
        url: `/api/appointments`
      }),
      axios({
        method: "GET",
        url: `/api/interviewers`
      }),
    ]).then(([days, appointments, interviewers]) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data });
    }).catch(error => console.log(error));
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview, changeSpots) {

    //update spots
    if (changeSpots) {
      for (let day of [...state.days]) {
        if (day.appointments.includes(id)) {
          day.spots -= 1;
        }
      }
    }

    return axios({
      method: "PUT",
      url: `/api/appointments/${id}`,
      data: { interview }
    })
      .then(response => {
        // appt state obj
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        }
        // keep moving up and can now make appts state obj
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        // set state on new state obj
        dispatch({ type: SET_INTERVIEW,
          appointments,
          interview: response.data
        });
      })
  }

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
  }

  return { state, setDay, bookInterview, deleteInterview }
}