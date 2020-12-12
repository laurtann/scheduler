import React from "react";
import './styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from '../../../src/hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //save appt to db
  //only change spots in create mode
  function save(name, interviewer, changeSpots) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview, changeSpots)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }

  // function to cancel appt & delete from db
  function cancelAppointment (name, interview) {
    transition(DELETING, true)
    props.deleteInterview(props.id, interview)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
  }

  // helper to transition to confirm deletion when form delete btn pressed
  function pressDelete() {
    transition(CONFIRM);
  }

  function editAppointment() {
    transition(EDIT);
  }

  return (
    <article className="appointment">
      <Header
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={pressDelete}
          onEdit={editAppointment}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          changeSpots={true}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure?"
          onCancel={back}
          onConfirm={cancelAppointment}
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting"
        />
      )}
      {mode === ERROR_SAVE&& (
        <Error
          message="Error while Saving"
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Error while Deleting"
          onClose={back}
        />
      )}
    </article>
  );
}