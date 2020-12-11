import React, { useState , useEffect} from "react";
import axios from 'axios';

export default function useApplicationData() {
  //state object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
      setState({ ...state, days: days.data, appointments: appointments.data, interviewers: interviewers.data })
    }).catch(error => console.log(error));
  }, []);

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
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
        setState({
          ...state,
          appointments,
          interview: response.data
        });
      })
      .catch(error => console.log(error));
  }

  function deleteInterview(id, interview) {
    return axios({
      method: "DELETE",
      url:`/api/appointments/${id}`
    })
    .then(response =>
      setState({
        ...state,
        interview: null
      })
    )
  }

  return{ state, setDay, bookInterview, deleteInterview }
}