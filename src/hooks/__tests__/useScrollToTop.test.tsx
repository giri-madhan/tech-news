import { renderHook } from '@testing-library/react';
import { useScrollToTop } from '../useScrollToTop';
import { MemoryRouter } from 'react-router-dom';

describe('useScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('scrolls to top when route changes', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/initial']}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToTop(), { wrapper });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
