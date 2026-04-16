import { useEffect } from 'react';

/**
 * Placeholder for future online/offline sync; keeps a stable hook API for layouts.
 */
export function useNetworkStatus() {
  useEffect(() => {
    // Intentionally empty — wire to networkStore when backend sync is added.
  }, []);
}
