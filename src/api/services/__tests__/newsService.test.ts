import { getTopTechNews, getArticleById } from '../newsService';
import { mockApiResponse, mockArticles } from '../../../utils/test-utils';
import axiosInstance from '../../config/axios';
import { apiCache } from '../../utils/apiCache';
import { NetworkError, NotFoundError } from '../../utils/apiErrors';
import { API_CONFIG } from '../../config/apiConfig';

jest.mock('../../config/axios', () => ({
  get: jest.fn(),
}));

jest.mock('../../utils/apiCache', () => ({
  apiCache: {
    get: jest.fn(),
    set: jest.fn(),
    generateKey: jest.fn(),
  },
}));

const mockGet = axiosInstance.get as jest.Mock;
const mockCacheGet = apiCache.get as jest.Mock;
const mockCacheSet = apiCache.set as jest.Mock;
const mockCacheGenerateKey = apiCache.generateKey as jest.Mock;
const mockArticle = mockArticles[0];

describe('newsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCacheGet.mockReturnValue(null);
    mockCacheGenerateKey.mockImplementation((path, params) => `${path}?${JSON.stringify(params)}`);
  });

  describe('getTopTechNews', () => {
    it('returns cached data if available', async () => {
      mockCacheGet.mockReturnValueOnce(mockApiResponse);

      const response = await getTopTechNews(1);

      expect(response).toEqual(mockApiResponse);
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('fetches tech news and caches the response', async () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });

      const response = await getTopTechNews(1);

      expect(response).toEqual(mockApiResponse);
      expect(mockGet).toHaveBeenCalledWith('/search', {
        params: expect.objectContaining({
          section: API_CONFIG.SECTIONS.TECHNOLOGY,
          page: '1',
          'show-fields': API_CONFIG.DEFAULT_FIELDS.LIST,
        }),
      });
      expect(mockCacheSet).toHaveBeenCalledWith(expect.any(String), mockApiResponse);
    });

    it('retries on network error', async () => {
      mockGet
        .mockRejectedValueOnce({ request: {} })
        .mockResolvedValueOnce({ data: mockApiResponse });

      const response = await getTopTechNews(1);

      expect(response).toEqual(mockApiResponse);
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it('throws NotFoundError on 404 response', async () => {
      mockGet.mockRejectedValueOnce({
        response: { status: 404, data: 'Not Found' },
      });

      await expect(getTopTechNews(1)).rejects.toThrow(NotFoundError);
    });

    it('throws NetworkError on request failure', async () => {
      mockGet.mockRejectedValueOnce({ request: {} });
      mockGet.mockRejectedValueOnce({ request: {} });
      mockGet.mockRejectedValueOnce({ request: {} });
      mockGet.mockRejectedValueOnce({ request: {} });

      await expect(getTopTechNews(1)).rejects.toThrow(NetworkError);
    });
  });

  describe('getArticleById', () => {
    it('returns cached article if available', async () => {
      mockCacheGet.mockReturnValueOnce(mockArticle);

      const response = await getArticleById('test-id');

      expect(response).toEqual(mockArticle);
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('fetches article by id and caches the response', async () => {
      mockGet.mockResolvedValueOnce({
        data: { response: { content: mockArticle } },
      });

      const response = await getArticleById('test-id');

      expect(response).toEqual(mockArticle);
      expect(mockGet).toHaveBeenCalledWith('/test-id', {
        params: expect.objectContaining({
          'show-fields': API_CONFIG.DEFAULT_FIELDS.DETAIL,
        }),
      });
      expect(mockCacheSet).toHaveBeenCalledWith(expect.any(String), mockArticle);
    });

    it('retries on network error', async () => {
      mockGet.mockRejectedValueOnce({ request: {} }).mockResolvedValueOnce({
        data: { response: { content: mockArticle } },
      });

      const response = await getArticleById('test-id');

      expect(response).toEqual(mockArticle);
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it('throws NotFoundError on 404 response', async () => {
      mockGet.mockRejectedValueOnce({
        response: { status: 404, data: 'Not Found' },
      });

      await expect(getArticleById('test-id')).rejects.toThrow(NotFoundError);
    });
  });
});
