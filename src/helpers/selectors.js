function getAppointmentsForDay (state, day) {
  const dayFound = state.days.find(currentDay => currentDay.name === day);
  if (!dayFound) {
    return [];
  }
  const appointments = dayFound.appointments.map(appointmentId => state.appointments[appointmentId]);
  return appointments;
}

function getInterview (state, interview) {
  let interviewObj = {};

  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer

  if (state.interviewers[interviewerId]) {
    interviewObj.student = interview.student;
    interviewObj.interviewer = state.interviewers[interviewerId]
    return interviewObj;
  }
  return null;
};

module.exports = { getAppointmentsForDay, getInterview };

