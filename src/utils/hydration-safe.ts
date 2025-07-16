// Utility functions to prevent hydration mismatches

// Generate stable random values based on a seed
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate consistent particle data for animations
export function generateParticles(count: number, seed: number = 12345) {
  return Array.from({ length: count }, (_, i) => {
    const particleSeed = seed + i;
    return {
      id: i,
      left: seededRandom(particleSeed * 1.1) * 100,
      top: seededRandom(particleSeed * 1.2) * 100,
      animationDelay: seededRandom(particleSeed * 1.3) * 5,
      animationDuration: 3 + seededRandom(particleSeed * 1.4) * 4,
    };
  });
}

// Safe window access hook
export function useSafeWindow() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
}

// Safe navigation function
export function safeGoBack() {
  if (typeof window !== 'undefined' && window.history) {
    window.history.back();
  }
}
