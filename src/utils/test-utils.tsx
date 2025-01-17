import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import articlesReducer, { ArticlesState } from '../features/articles/articlesSlice';
import articleDetailReducer, { ArticleDetailState } from '../features/articles/articleDetailSlice';
import { Article } from '../types/guardian';

export const mockArticles: Article[] = [
  {
    id: '1',
    webTitle: 'Test Article 1',
    webUrl: 'https://example.com/1',
    webPublicationDate: '2024-01-01T12:00:00Z',
    sectionName: 'technology',
    fields: {
      trailText: 'Test description 1',
      thumbnail: 'https://example.com/image1.jpg',
    },
  },
  {
    id: '2',
    webTitle: 'Test Article 2',
    webUrl: 'https://example.com/2',
    webPublicationDate: '2024-01-02T12:00:00Z',
    sectionName: 'technology',
    fields: {
      trailText: 'Test description 2',
      thumbnail: 'https://example.com/image2.jpg',
    },
  },
];

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: {
    articles?: ArticlesState;
    articleDetail?: ArticleDetailState;
  };
  useRouter?: boolean;
  initialEntries?: string[];
}

const defaultInitialState = {
  articles: {
    items: [],
    status: 'idle',
    error: null,
    hasMore: true,
    currentPage: 1,
  } as ArticlesState,
  articleDetail: {
    article: null,
    status: 'idle',
    error: null,
  } as ArticleDetailState,
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    useRouter = true,
    initialEntries = ['/'],
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      articles: articlesReducer,
      articleDetail: articleDetailReducer,
    },
    preloadedState: {
      ...defaultInitialState,
      ...preloadedState,
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
    const content = <Provider store={store}>{children}</Provider>;
    return useRouter ? (
      <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
    ) : (
      content
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const mockApiResponse = {
  response: {
    status: 'ok',
    total: 2,
    pages: 1,
    results: mockArticles,
  },
};
