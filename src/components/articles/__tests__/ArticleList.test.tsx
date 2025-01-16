import React from 'react';
import { screen } from '@testing-library/react';
import ArticleList from '../ArticleList';
import useArticles from '../../../hooks/useArticles';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { renderWithProviders } from '../../../utils/test-utils';

// Mock the hooks
jest.mock('../../../hooks/useArticles');
jest.mock('../../../hooks/useIntersectionObserver');

const mockArticles = [
  {
    id: '1',
    webTitle: 'Test Article 1',
    webUrl: 'https://test.com/1',
    webPublicationDate: '2024-01-14T12:00:00Z',
    fields: {
      thumbnail: 'https://test.com/image1.jpg',
      trailText: 'Test Description 1',
    },
  },
  {
    id: '2',
    webTitle: 'Test Article 2',
    webUrl: 'https://test.com/2',
    webPublicationDate: '2024-01-14T13:00:00Z',
    fields: {
      thumbnail: 'https://test.com/image2.jpg',
      trailText: 'Test Description 2',
    },
  },
];

describe('ArticleList', () => {
  const mockLastItemRef = jest.fn();

  beforeEach(() => {
    (useIntersectionObserver as jest.Mock).mockReturnValue(mockLastItemRef);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: [],
      status: 'loading',
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
    });

    renderWithProviders(<ArticleList />);

    expect(screen.getByLabelText('Loading articles')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load articles';
    (useArticles as jest.Mock).mockReturnValue({
      articles: [],
      status: 'failed',
      error: errorMessage,
      hasMore: false,
      loadMore: jest.fn(),
    });

    renderWithProviders(<ArticleList />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('renders articles correctly', () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      status: 'succeeded',
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
    });

    renderWithProviders(<ArticleList />);

    mockArticles.forEach(article => {
      expect(screen.getByText(article.webTitle)).toBeInTheDocument();
      expect(screen.getByText(article.fields.trailText)).toBeInTheDocument();
    });
  });

  it('shows loading more indicator when loading additional articles', () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      status: 'loading',
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
    });

    renderWithProviders(<ArticleList />);

    expect(screen.getByLabelText('Loading more articles')).toBeInTheDocument();
  });

  it('sets up intersection observer correctly', () => {
    const mockLoadMore = jest.fn();
    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      status: 'succeeded',
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
    });

    renderWithProviders(<ArticleList />);

    expect(useIntersectionObserver).toHaveBeenCalledWith({
      onIntersect: mockLoadMore,
      enabled: true,
      rootMargin: '200px',
    });
  });

  it('renders header content correctly', () => {
    (useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      status: 'succeeded',
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
    });

    renderWithProviders(<ArticleList />);

    expect(screen.getByText('Latest Tech News')).toBeInTheDocument();
    expect(
      screen.getByText('Stay updated with the latest technology news and insights')
    ).toBeInTheDocument();
  });
});
