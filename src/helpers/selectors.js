function getAppointmentsForDay (state, day) {
  const selectedDay = state.days.filter(d => d.name === day);
  if (!state.days.length || !selectedDay.length) {
    return [];
  }
  const appointments = selectedDay[0].appointments;
  let apptArray = [];
  for (let appt of appointments) {
    apptArray.push(state.appointments[appt])
  }
  return apptArray;
} 

module.exports = { getAppointmentsForDay };

