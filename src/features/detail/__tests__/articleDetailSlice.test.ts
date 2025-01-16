import { configureStore, AnyAction } from '@reduxjs/toolkit';
import articleDetailReducer, {
  fetchArticleById,
  setCurrentArticle,
  clearArticle,
  ArticleDetailState,
} from '../articleDetailSlice';
import { getArticleById } from '../../../api/services/newsService';
import { Article } from '../../../types/guardian';

// Mock the API service
jest.mock('../../../api/services/newsService');

const mockArticle: Article = {
  id: 'test-id',
  webTitle: 'Test Article',
  webUrl: 'https://test.com',
  webPublicationDate: '2024-01-16T00:00:00Z',
  sectionName: 'Technology',
  fields: {
    thumbnail: 'test-thumbnail',
    trailText: 'test trail text',
    body: 'test body text',
  },
};

interface RootState {
  articleDetail: ArticleDetailState;
}

describe('articleDetailSlice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        articleDetail: articleDetailReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('clearArticle', () => {
    it('should clear the article state', async () => {
      // Set initial state with some data
      await store.dispatch(setCurrentArticle(mockArticle) as unknown as AnyAction);

      // Clear the state
      store.dispatch(clearArticle());

      const state = store.getState();
      expect(state.articleDetail).toEqual({
        article: null,
        status: 'idle',
        error: null,
      });
    });
  });

  describe('setCurrentArticle', () => {
    it('should handle pending state', async () => {
      const promise = store.dispatch(setCurrentArticle(mockArticle) as unknown as AnyAction);
      const state = store.getState();
      expect(state.articleDetail.status).toBe('loading');
      await promise;
    });

    it('should handle successful article setting', async () => {
      await store.dispatch(setCurrentArticle(mockArticle) as unknown as AnyAction);
      const state = store.getState();

      expect(state.articleDetail.status).toBe('succeeded');
      expect(state.articleDetail.article).toEqual(mockArticle);
      expect(state.articleDetail.error).toBeNull();
    });

    it('should handle rejection', async () => {
      const errorMessage = 'Failed to set article';
      const failedAction = {
        type: setCurrentArticle.rejected.type,
        error: { message: errorMessage },
      };

      store.dispatch(failedAction);
      const state = store.getState();

      expect(state.articleDetail.status).toBe('failed');
      expect(state.articleDetail.error).toBe(errorMessage);
    });
  });

  describe('fetchArticleById', () => {
    it('should handle pending state', async () => {
      const promise = store.dispatch(fetchArticleById('test-id') as unknown as AnyAction);
      const state = store.getState();
      expect(state.articleDetail.status).toBe('loading');
      await promise.catch(() => {}); // Ignore potential rejection
    });

    it('should handle successful article fetch', async () => {
      (getArticleById as jest.Mock).mockResolvedValueOnce(mockArticle);

      await store.dispatch(fetchArticleById('test-id') as unknown as AnyAction);
      const state = store.getState();

      expect(getArticleById).toHaveBeenCalledWith('test-id');
      expect(state.articleDetail.status).toBe('succeeded');
      expect(state.articleDetail.article).toEqual(mockArticle);
      expect(state.articleDetail.error).toBeNull();
    });

    it('should handle fetch failure', async () => {
      const errorMessage = 'Network Error';
      (getArticleById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchArticleById('test-id') as unknown as AnyAction).catch(() => {});
      const state = store.getState();

      expect(state.articleDetail.status).toBe('failed');
      expect(state.articleDetail.error).toBe(errorMessage);
      expect(state.articleDetail.article).toBeNull();
    });

    it('should handle fetch failure with default error message', async () => {
      (getArticleById as jest.Mock).mockRejectedValueOnce(new Error());

      await store.dispatch(fetchArticleById('test-id') as unknown as AnyAction).catch(() => {});
      const state = store.getState();

      expect(state.articleDetail.status).toBe('failed');
      expect(state.articleDetail.error).toBe('Failed to fetch article');
    });
  });
});
