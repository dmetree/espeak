import React from 'react';

import s from './.module.css';
import { RequestList } from './ui/PsyRequestList/PsyRequestList';

const DisplayPsyRequests = ({ requests }) => {
  return (
    <div>
      <RequestList requests={requests} />
    </div>
  );
};

export default DisplayPsyRequests;
