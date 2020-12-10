function getAppointmentsForDay (state, day) {
  let apptArray = [];
  const selectedDay = state.days.filter(d => d.name === day);
  if (!state.days.length || !selectedDay.length) {
    return apptArray;
  }
  const appointments = selectedDay[0].appointments;
  for (let appt of appointments) {
    apptArray.push(state.appointments[appt])
  }
  return apptArray;
}

function getInterview (state, interview) {
  let interviewObj = {};

  if (!interview) {
    return null;
  }

  let interviewerId = interview.interviewer

  if (state.interviewers[interviewerId]) {
    interviewObj.student = interview.student;
    interviewObj.interviewer = state.interviewers[interviewerId]
    return interviewObj;
  }
  return null;
};


module.exports = { getAppointmentsForDay, getInterview };

