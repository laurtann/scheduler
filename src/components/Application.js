import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from './DayList';
import "components/Application.scss";
import Appointment from 'components/Appointment'
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors'

export default function Application(props) {

  //state object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // book interview using appt id and interview obj
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

  //this works
  // console.log("These are interviewers, ", state.interviewers);
  // console.log("These are appts, ", state.appointments);
  // console.log("These are days, ", state.days);

  // helpers
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // seperate action from state
  const setDay = day => setState({ ...state, day });

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

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {
          dailyAppointments.map(appointment => {
            const interview = getInterview(state, appointment.interview);
            return (
              <Appointment
                key={appointment.id}
                id={appointment.id}
                time={appointment.time}
                interview={interview}
                interviewers={dailyInterviewers}
                bookInterview={bookInterview}
              />
            );
          })
        }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}




