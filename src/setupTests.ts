import '@testing-library/jest-dom';

/**
 * Mock implementation of the IntersectionObserver API for testing.
 * This is necessary because jsdom doesn't support IntersectionObserver.
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: readonly number[] = [0];

  observe: (target: Element) => void;
  disconnect: () => void;
  unobserve: (target: Element) => void;
  takeRecords: () => IntersectionObserverEntry[];

  constructor() {
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.unobserve = jest.fn();
    this.takeRecords = jest.fn().mockReturnValue([]);
  }
}

// Set up IntersectionObserver mock
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

/**
 * Mock implementation of the matchMedia API for testing.
 * Returns a mock MediaQueryList with default values and mock methods.
 */
const createMockMediaQueryList = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  addListener: jest.fn(), // Deprecated but kept for backwards compatibility
  removeListener: jest.fn(), // Deprecated but kept for backwards compatibility
});

// Set up matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => createMockMediaQueryList(query)),
});

// Increase default timeout for tests to accommodate slower operations
jest.setTimeout(30000);
