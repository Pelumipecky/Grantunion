/**
 * Session Initializer Component
 * Handles client-side session initialization
 */
'use client';

import { useEffect } from 'react';
import { getCurrentSessionId } from '../utils/sessionManager';

const SessionInitializer = () => {
  useEffect(() => {
    // Initialize session ID for the user
    getCurrentSessionId();
  }, []);

  return null; // This component doesn't render anything
};

export default SessionInitializer;