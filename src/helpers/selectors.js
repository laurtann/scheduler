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

module.exports = { getAppointmentsForDay };

