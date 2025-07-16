import { useEffect, useState } from 'react';

// Hook to ensure components only render animations on the client side
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Hook for client-side only effects
export function useClientEffect(effect: () => void | (() => void), deps?: React.DependencyList) {
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, [isClient, ...(deps || [])]);
}
