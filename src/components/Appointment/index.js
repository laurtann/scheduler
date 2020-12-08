import React from "react";
import './styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
// import classNames from 'classnames';

export default function Appointment(props) {
  return (
    <article className="appointment">{props.time}</article>
  );
}