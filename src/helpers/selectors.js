
//find obj in state.days arr whose name matches "DAY",
// with that, access DAY appt arr
// iterate, compare where id matches id of state.appts
// return that value
// if no appts on the day, return []

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

