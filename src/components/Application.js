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
    console.log("This is in bookinterview id, interview ", id, interview);
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
      setState({ ...state, days: days.data, appointments: appointments.data, interviewers: interviewers.data})
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
            const newInterviewBooking = bookInterview(appointment.id, interview);
            return (
              <Appointment
                key={appointment.id}
                id={appointment.id}
                time={appointment.time}
                interview={interview}
                interviewers={dailyInterviewers}
                bookInterview={newInterviewBooking}
              />
            );
          })
        }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}




