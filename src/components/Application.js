import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from './DayList';
import "components/Application.scss";
import Appointment from 'components/Appointment'
import { getAppointmentsForDay, getInterview } from '../helpers/selectors'

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Maximillian Barcelona",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Bart Michaels",
//       interviewer: {
//         id: 3,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Natalie Wilde",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },

// ];

export default function Application(props) {

  //make a state obj
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //this works
  console.log("These are interviewers, ", state.interviewers);
  console.log("These are appts, ", state.appointments);
  console.log("These are days, ", state.days);


  const dailyAppointments = getAppointmentsForDay(state, state.day);

  //seperating actions to update certain parts of the state
  //spread will take all the existing keys in state - keys declared will overwrite old ones
  //So we're updating state w new day
  const setDay = day => setState({ ...state, day });

  //creating setDays action 4 axios req
  //remove dependency on state w function
  // const setDays = days => setState({ ...state, days });

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
            return (
              <Appointment
                key={appointment.id}
                id={appointment.id}
                time={appointment.time}
                interview={interview}
              />
            );
          })
        }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}




