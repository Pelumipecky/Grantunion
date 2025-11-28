/**
 * Session Info Component
 * Displays current session information for debugging
 */
'use client';

import React from 'react';
import { getSessionInfo, getCurrentSessionId } from '../utils/sessionManager';

const SessionInfo = () => {
  const sessionInfo = getSessionInfo();
  const currentSessionId = getCurrentSessionId();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Session ID:</strong></div>
      <div style={{ wordBreak: 'break-all', fontSize: '10px' }}>
        {currentSessionId}
      </div>
      <div><strong>Valid:</strong> {sessionInfo.isValid ? '✅' : '❌'}</div>
      <div><strong>Expires:</strong> {sessionInfo.sessionExpiry ? new Date(sessionInfo.sessionExpiry).toLocaleString() : 'N/A'}</div>
    </div>
  );
};

export default SessionInfo;