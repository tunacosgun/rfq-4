import { useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useVisitorTracking = (pageName) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/track-visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pageName || window.location.pathname,
          }),
        });
      } catch (error) {
        // Silent fail - don't disrupt user experience
        console.debug('Tracking skipped');
      }
    };

    trackVisit();
  }, [pageName]);
};
