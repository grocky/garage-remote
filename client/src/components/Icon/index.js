import React from 'react';
import { ReactComponent as GarageClosed } from './garage-closed.svg';
import { ReactComponent as GarageOpen } from './garage-open.svg';

const Icon = props => {
  switch(props.name) {
    case "garage-closed":
      return <GarageClosed {...props} />;
    case "garage-open":
      return <GarageOpen {...props} />;
    default:
      return <div />;
  }
};

export default Icon;
