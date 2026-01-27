// Get or create session ID for anonymous users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem("career_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("career_session_id", sessionId);
  }
  return sessionId;
};

// Get headers for session-based requests
export const getSessionHeaders = (): Record<string, string> => {
  return {
    'x-session-id': getSessionId(),
  };
};
