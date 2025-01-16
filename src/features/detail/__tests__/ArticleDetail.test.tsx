import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { renderWithProviders, mockArticles } from '../../../utils/test-utils';
import ArticleDetail from '../ArticleDetail';
import { useAppDispatch } from '../../../redux/store';

// Suppress React Router deprecation warnings in tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router') || args[0].includes('Unexpected key'))
    )
      return;
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

// Mock the redux dispatch
jest.mock('../../../redux/store', () => ({
  ...jest.requireActual('../../../redux/store'),
  useAppDispatch: jest.fn(),
}));

// Mock the scroll to top hook
jest.mock('../../../hooks/useScrollToTop', () => ({
  useScrollToTop: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('ArticleDetail', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (useAppDispatch as jest.Mock).mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'loading',
          error: null,
        },
      },
    });

    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message when article fetch fails', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const errorMessage = 'Failed to fetch article';
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'failed',
          error: errorMessage,
        },
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back to articles/i })).toBeInTheDocument();
  });

  it('should display article content when fetch succeeds', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const article = mockArticles[0];
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article,
          status: 'succeeded',
          error: null,
        },
      },
    });

    expect(screen.getByText(article.webTitle)).toBeInTheDocument();
    expect(screen.getByText(article.sectionName)).toBeInTheDocument();
    expect(screen.getByText(article.fields.trailText)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', article.fields.thumbnail);
  });

  it('should navigate back when back button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const article = mockArticles[0];
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const backButton = screen.getByRole('button', { name: /go back to articles/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate home when article id is missing', () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/'],
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show "Read Full Article" link when body is not available', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const articleWithoutBody = {
      ...mockArticles[0],
      fields: {
        ...mockArticles[0].fields,
        body: undefined,
      },
    };

    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article: articleWithoutBody,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const link = screen.getByRole('link', { name: /read full article/i });
    expect(link).toHaveAttribute('href', articleWithoutBody.webUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display article body when available', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const articleWithBody = {
      ...mockArticles[0],
      fields: {
        ...mockArticles[0].fields,
        body: '<p>Test article body</p>',
      },
    };

    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article: articleWithBody,
          status: 'succeeded',
          error: null,
        },
      },
    });

    expect(screen.getByText('Test article body')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /read full article/i })).not.toBeInTheDocument();
  });

  it('should format the publication date correctly', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const article = mockArticles[0];
    renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const formattedDate = new Date(article.webPublicationDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('should clean up on unmount', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const { unmount } = renderWithProviders(<ArticleDetail />, {
      initialEntries: ['/article/1'],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'idle',
          error: null,
        },
      },
    });

    act(() => {
      unmount();
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'articleDetail/clearArticle' });
  });

  it('should fetch article on mount with valid id', () => {
    const articleId = '123';
    (useParams as jest.Mock).mockReturnValue({ id: articleId });

    renderWithProviders(<ArticleDetail />, {
      initialEntries: [`/article/${articleId}`],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'idle',
          error: null,
        },
      },
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(typeof dispatchedAction).toBe('function');
  });

  it('should handle article fetch rejection', async () => {
    const articleId = '123';
    const errorMessage = 'Network error';
    (useParams as jest.Mock).mockReturnValue({ id: articleId });

    // Mock dispatch to simulate the initial fetch call
    mockDispatch.mockImplementationOnce(() => ({
      type: 'articleDetail/fetchArticleById/rejected',
      error: { message: errorMessage },
    }));

    renderWithProviders(<ArticleDetail />, {
      initialEntries: [`/article/${articleId}`],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'failed',
          error: errorMessage,
        },
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back to articles/i })).toBeInTheDocument();
  });

  it('should handle setCurrentArticle rejection', async () => {
    const article = mockArticles[0];
    const errorMessage = 'Failed to set article';
    (useParams as jest.Mock).mockReturnValue({ id: article.id });

    // Mock dispatch to simulate the setCurrentArticle failure
    mockDispatch.mockImplementationOnce(() => ({
      type: 'articleDetail/setCurrentArticle/rejected',
      error: { message: errorMessage },
    }));

    renderWithProviders(<ArticleDetail />, {
      initialEntries: [`/article/${article.id}`],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'failed',
          error: errorMessage,
        },
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back to articles/i })).toBeInTheDocument();
  });

  it('should handle fetchArticleById rejection with custom error message', async () => {
    const articleId = '123';
    const customError = 'Custom error message';
    (useParams as jest.Mock).mockReturnValue({ id: articleId });

    // Mock dispatch to simulate the fetch failure with custom error
    mockDispatch.mockImplementationOnce(() => ({
      type: 'articleDetail/fetchArticleById/rejected',
      error: { message: customError },
    }));

    renderWithProviders(<ArticleDetail />, {
      initialEntries: [`/article/${articleId}`],
      preloadedState: {
        articleDetail: {
          article: null,
          status: 'failed',
          error: customError,
        },
      },
    });

    expect(screen.getByText(customError)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back to articles/i })).toBeInTheDocument();
  });
});
