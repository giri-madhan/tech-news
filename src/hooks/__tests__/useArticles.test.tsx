import { renderHook, act } from '@testing-library/react';
import { mockArticles } from '../../utils/test-utils';
import { useArticles } from '../useArticles';
import { ArticlesState } from '../../features/articles/articlesSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../../features/articles/articlesSlice';
import articleDetailReducer from '../../features/detail/articleDetailSlice';
import { RootState } from '../../redux/store';
import axiosInstance from '../../api/config/axios';
import type { RenderHookResult } from '@testing-library/react';

// Mock the axios module first
const mockApiResponse = {
  data: {
    response: {
      status: 'ok',
      total: 2,
      pages: 1,
      results: mockArticles,
    },
  },
};

jest.mock('../../api/config/axios', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useArticles', () => {
  const mockAxios = axiosInstance as jest.MockedFunction<typeof axiosInstance>;

  const createStore = (preloadedState?: Partial<ArticlesState>) => {
    return configureStore({
      reducer: {
        articles: articlesReducer,
        articleDetail: articleDetailReducer,
      },
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          thunk: true,
          serializableCheck: false,
        }),
      preloadedState: {
        articles: {
          items: [],
          status: 'idle',
          error: null,
          hasMore: true,
          currentPage: 1,
          ...preloadedState,
        } as ArticlesState,
        articleDetail: {
          article: null,
          status: 'idle',
          error: null,
        },
      } as RootState,
    });
  };

  // Types for the hook result
  type UseArticlesResult = ReturnType<typeof useArticles>;
  type SetupResult = {
    result: RenderHookResult<UseArticlesResult, undefined>['result'];
    store: ReturnType<typeof createStore>;
  };

  const setup = (preloadedState?: Partial<ArticlesState>): SetupResult => {
    const store = createStore(preloadedState);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const renderResult = renderHook(() => useArticles(), { wrapper });
    return { result: renderResult.result, store };
  };

  beforeEach(() => {
    mockAxios.mockClear();
    mockAxios.mockResolvedValue(mockApiResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch articles on initial mount when items are empty', async () => {
    // Setup with a promise that we can control
    let resolveApi: (value: typeof mockApiResponse) => void;
    const apiPromise = new Promise<typeof mockApiResponse>(resolve => {
      resolveApi = resolve;
    });
    mockAxios.mockImplementation(() => apiPromise);

    // Initial render
    const { result } = setup();

    // Initial state should have no items
    expect(result.current.articles).toHaveLength(0);

    // Let the effect run and check loading state
    await act(async () => {
      await new Promise(resolve => process.nextTick(resolve));
    });
    expect(result.current.status).toBe('loading');

    // Resolve the API call
    await act(async () => {
      resolveApi!(mockApiResponse);
      await apiPromise;
      await new Promise(resolve => process.nextTick(resolve));
    });

    // Final state should be succeeded with items
    expect(result.current.status).toBe('succeeded');
    expect(result.current.articles).toEqual(mockArticles);
  });

  it('should not fetch articles on mount if items exist', () => {
    const { result } = setup({
      items: mockArticles,
      status: 'succeeded',
    });

    expect(result.current.articles).toEqual(mockArticles);
    expect(result.current.status).toBe('succeeded');
    expect(mockAxios).not.toHaveBeenCalled();
  });

  it('should load more articles when loadMore is called', async () => {
    // Setup with a promise that we can control
    let resolveApi: (value: typeof mockApiResponse) => void;
    const apiPromise = new Promise<typeof mockApiResponse>(resolve => {
      resolveApi = resolve;
    });
    mockAxios.mockImplementation(() => apiPromise);

    const { result, store } = setup({
      items: mockArticles,
      status: 'succeeded',
      hasMore: true,
    });

    expect(result.current.articles).toHaveLength(mockArticles.length);

    // Call loadMore
    let loadMorePromise: Promise<void>;
    await act(async () => {
      loadMorePromise = result.current.loadMore();
      await new Promise(resolve => process.nextTick(resolve));
    });

    // State should be loading
    expect(store.getState().articles.status).toBe('loading');

    // Resolve the API call
    await act(async () => {
      resolveApi!(mockApiResponse);
      await loadMorePromise;
      await new Promise(resolve => process.nextTick(resolve));
    });

    // Final state should be succeeded with more items
    expect(store.getState().articles.status).toBe('succeeded');
    expect(store.getState().articles.items).toHaveLength(mockArticles.length * 2);
  });

  it('should not load more articles when status is loading', async () => {
    const { result } = setup({
      items: mockArticles,
      status: 'loading',
      hasMore: true,
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.articles).toEqual(mockArticles);
    expect(mockAxios).not.toHaveBeenCalled();
  });

  it('should not load more articles when hasMore is false', async () => {
    const { result } = setup({
      items: mockArticles,
      status: 'succeeded',
      hasMore: false,
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.articles).toEqual(mockArticles);
    expect(mockAxios).not.toHaveBeenCalled();
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch articles';
    mockAxios.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = setup();

    // Wait for the effect and error to propagate
    await act(async () => {
      await new Promise(resolve => process.nextTick(resolve));
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.status).toBe('failed');
  });
});
