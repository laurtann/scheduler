// returns array of appointments for the day
function getAppointmentsForDay (state, day) {
  const dayFound = state.days.find(currentDay => currentDay.name === day);
  if (!dayFound) {
    return [];
  }
  const appointments = dayFound.appointments.map(appointmentId => state.appointments[appointmentId]);
  return appointments;
}

// returns interview object
function getInterview (state, interview) {
  let interviewObj = {};

  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;

  if (state.interviewers[interviewerId]) {
    interviewObj.student = interview.student;
    interviewObj.interviewer = state.interviewers[interviewerId];
    return interviewObj;
  }
  return null;
};

// returns array of interviewers for the day
function getInterviewersForDay (state, day) {
  const dayFound = state.days.find(currentDay => currentDay.name === day);
  if (!dayFound) {
    return [];
  }
  const interviewers = dayFound.interviewers.map(interviewerId => state.interviewers[interviewerId]);
  return interviewers;
}

module.exports = { getAppointmentsForDay, getInterview, getInterviewersForDay };

