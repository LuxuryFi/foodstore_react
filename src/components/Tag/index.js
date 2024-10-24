import React, { useEffect, useState } from 'react';

export default function Tag({ status }) {
  const [statusTag, setStatusTag] = useState();
  console.log('status', status);
  useEffect(() => {
    switch (status) {
      case 'CREATED':
        setStatusTag('tag--received');
        break;
      case 'canceled' || 'Canceled':
        setStatusTag('tag--canceled');
        break;
      case 'done' || 'Done':
        setStatusTag('tag--done');
        break;
      case 'in progress' || 'In progress':
        setStatusTag('tag--inprogress');
        break;
      case 'isBlocking' || 'IsBlocking':
        setStatusTag('tag--isBlocking');
        break;
      case 'waiting' || 'Waiting':
        setStatusTag('tag--waiting');
        break;
      case 'RESOLVED':
        setStatusTag('tag--resolved');
        break;
      default:
        break;
    }
  }, [status]);

  return <div className={`tag ${statusTag}`}>{status}</div>;
}
