import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../App';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import { getTopTechNews } from '../api/services/newsService';
import { GuardianResponse } from '../types/guardian';

jest.mock('../api/services/newsService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockGetTopTechNews = getTopTechNews as jest.MockedFunction<typeof getTopTechNews>;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    mockGetTopTechNews.mockResolvedValue({
      response: {
        results: [],
        status: 'ok',
        total: 0,
        pages: 0,
      },
    } as GuardianResponse);
  });

  afterEach(() => {
    // Clean up window.scrollTo mock
    jest.resetAllMocks();
  });

  describe('Layout and Structure', () => {
    it('renders app structure correctly', async () => {
      renderWithProviders(<App />);

      await waitFor(() => {
        const loadingSpinner = screen.getByRole('status');
        expect(loadingSpinner).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('catches and displays errors using ErrorBoundary', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      renderWithProviders(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops!')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
      mockGetTopTechNews.mockRejectedValue(new Error('API Error'));

      renderWithProviders(<App />);

      await waitFor(() => {
        const loadingSpinner = screen.getByRole('status');
        expect(loadingSpinner).toBeInTheDocument();
      });
    });
  });
});
