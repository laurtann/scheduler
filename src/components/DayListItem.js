import React from "react";
import './DayListItem.scss';
import classNames from 'classnames';

export default function DayListItem(props) {
  // conditionally change styling of dayListItem component
  const dayListItemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots
  });

  // helper to format number of spots remaining in dayListItem
  const formatSpots = (spots) => {
    if (spots === 0) {
      return "no spots remaining";
    }
    else if (spots === 1) {
      return "1 spot remaining";
    } else {
      return `${spots} spots remaining`;
    }
  }
  return (
    <li onClick={() => props.setDay(props.name)} className={dayListItemClass}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}