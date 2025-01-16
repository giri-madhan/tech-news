import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';

describe('useIntersectionObserver', () => {
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();
  const mockIntersectionObserver = jest.fn();

  beforeEach(() => {
    mockIntersectionObserver.mockReset();
    mockObserve.mockReset();
    mockDisconnect.mockReset();

    mockIntersectionObserver.mockImplementation(callback => {
      // Store callback to simulate intersection later
      const observer = {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };

      // Simulate an intersection immediately for testing
      setTimeout(() => {
        callback([{ isIntersecting: true } as IntersectionObserverEntry], observer);
      }, 0);

      return observer;
    });

    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should create an intersection observer when enabled', () => {
    const onIntersect = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onIntersect, enabled: true }));

    const element = document.createElement('div');
    result.current(element);

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('should not create an intersection observer when disabled', () => {
    const onIntersect = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onIntersect, enabled: false }));

    const element = document.createElement('div');
    result.current(element);

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should disconnect observer when unmounting', () => {
    const onIntersect = jest.fn();
    const { result, unmount } = renderHook(() => useIntersectionObserver({ onIntersect }));

    const element = document.createElement('div');
    result.current(element);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should call onIntersect when element intersects', () => {
    const onIntersect = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onIntersect }));

    const element = document.createElement('div');
    result.current(element);

    // Get the callback passed to IntersectionObserver
    const [[callback]] = mockIntersectionObserver.mock.calls;

    // Simulate intersection
    callback([{ isIntersecting: true }]);

    expect(onIntersect).toHaveBeenCalled();
  });

  it('should respect custom rootMargin and threshold', () => {
    const onIntersect = jest.fn();
    const rootMargin = '10px';
    const threshold = 0.5;

    const { result } = renderHook(() =>
      useIntersectionObserver({ onIntersect, rootMargin, threshold })
    );

    const element = document.createElement('div');
    result.current(element);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin,
        threshold,
      })
    );
  });
});
