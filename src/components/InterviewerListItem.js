import React from "react";
import './InterviewerListItem.scss';
import classNames from 'classnames';

export default function InterviewerListItem(props) {
  const interviewListItemClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected
  });

  // const interviewListItemClassImg = classNames('interviewers__item-image', {
  //   'interviewers__item--selected-image': props.selected
  // });


  return (
    // <li onClick={() => props.setInterviewer(props.name)} className={interviewListItemClass}>
    <li onClick={props.setInterviewer} className={interviewListItemClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}