/**
 * Session Management Utility
 * Generates and manages unique session IDs for user transactions
 */
'use client';

const SESSION_STORAGE_KEY = 'user_session_id';
const SESSION_EXPIRY_KEY = 'user_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a unique session ID
 * @returns {string} Unique session identifier
 */
export const generateSessionId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  const userAgent = navigator.userAgent.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '');
  return `${timestamp}-${randomString}-${userAgent}`;
};

/**
 * Get or create a session ID for the current user
 * @returns {string} Current session ID
 */
export const getCurrentSessionId = () => {
  const now = Date.now();
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  let sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

  // Check if session exists and is still valid
  if (sessionId && sessionExpiry && now < parseInt(sessionExpiry)) {
    return sessionId;
  }

  // Generate new session ID
  sessionId = generateSessionId();
  sessionExpiry = (now + SESSION_DURATION).toString();

  // Store in localStorage
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  localStorage.setItem(SESSION_EXPIRY_KEY, sessionExpiry);

  return sessionId;
};

/**
 * Clear the current session
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
};

/**
 * Get session information
 * @returns {object} Session details
 */
export const getSessionInfo = () => {
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

  return {
    sessionId,
    sessionExpiry: sessionExpiry ? new Date(parseInt(sessionExpiry)) : null,
    isValid: sessionId && sessionExpiry && Date.now() < parseInt(sessionExpiry)
  };
};

/**
 * Extend session expiry
 */
export const extendSession = () => {
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (sessionId) {
    const newExpiry = (Date.now() + SESSION_DURATION).toString();
    localStorage.setItem(SESSION_EXPIRY_KEY, newExpiry);
  }
};