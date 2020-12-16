// consts for reducer
export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const BOOK_INTERVIEW = "BOOK_INTERVIEW";
export const DELETE_INTERVIEW = "DELETE_INTERVIEW";
export const SET_DAYS_DATA = "SET_DAYS_DATA";

export default function getReducer (refreshDaysData) {
  function reducer(state, action) {
    if (action.type === SET_DAY) {
      return {
        ...state,
        day: action.day
      };
    }
    // update state from days/appts/interviewers get req
    if (action.type === SET_APPLICATION_DATA) {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    }
    // update state for spots
    if (action.type === SET_DAYS_DATA) {
      return {
        ...state,
        days: action.days,
      };
    }
    // update state for appt handling
    if (action.type === BOOK_INTERVIEW || action.type === DELETE_INTERVIEW || action.type === SET_INTERVIEW) {
      const appointment = {
        ...state.appointments[action.appointmentId],
        interview: action.interview ? {...action.interview } : null
      };

      const appointments = {
        ...state.appointments,
        [action.appointmentId]: appointment
      };

      // function to update spots
      refreshDaysData();

      return {
        ...state,
        appointments,
      };
    }

    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
  return reducer;
}