import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import ArticleItem from '../ArticleItem';

// Mock the hooks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../redux/store', () => ({
  useAppDispatch: jest.fn(),
}));

describe('ArticleItem', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  const defaultProps = {
    id: '123',
    title: 'Test Article',
    description: 'Test Description',
    url: 'https://test.com',
    urlToImage: 'https://test.com/image.jpg',
    publishedAt: '2024-01-14T12:00:00Z',
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders article content correctly', () => {
    render(<ArticleItem {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.urlToImage);
    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      `Thumbnail for article: ${defaultProps.title}`
    );
  });

  it('uses placeholder image when urlToImage is not provided', () => {
    render(<ArticleItem {...defaultProps} urlToImage={undefined} />);

    const img = screen.getByAltText('');
    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('formats date correctly', () => {
    render(<ArticleItem {...defaultProps} />);

    const date = new Date(defaultProps.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('handles click event correctly', () => {
    render(<ArticleItem {...defaultProps} />);

    fireEvent.click(screen.getByRole('article'));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/article/${defaultProps.id}`);
  });

  it('handles keyboard navigation', () => {
    render(<ArticleItem {...defaultProps} />);

    const article = screen.getByRole('article');

    // Test Enter key
    fireEvent.keyDown(article, { key: 'Enter', code: 'Enter' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/article/${defaultProps.id}`);

    jest.clearAllMocks();

    // Test Space key
    fireEvent.keyDown(article, { key: ' ', code: 'Space' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/article/${defaultProps.id}`);
  });

  it('has correct accessibility attributes', () => {
    render(<ArticleItem {...defaultProps} />);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('tabIndex', '0');
    expect(screen.getByText('Read full article →')).toBeInTheDocument();
  });
});
