import { Article, GuardianResponse } from '../../types/guardian';
import axiosInstance from '../config/axios';
import { API_CONFIG, getApiKey } from '../config/apiConfig';
import { ApiError, NetworkError, NotFoundError } from '../utils/apiErrors';
import { apiCache } from '../utils/apiCache';

interface ApiErrorResponse {
  response?: {
    status: number;
    data: unknown;
  };
  request?: unknown;
}

const handleApiError = (error: ApiErrorResponse | Error, customMessage: string): never => {
  if ('response' in error && error.response) {
    if (error.response.status === 404) {
      throw new NotFoundError('Article');
    }
    throw new ApiError(customMessage, error.response.status, error.response.data);
  }
  if (error instanceof NetworkError) {
    throw error;
  }
  if ('request' in error && error.request) {
    throw new NetworkError();
  }
  throw new ApiError(customMessage);
};

const fetchWithRetry = async <T>(
  apiCall: () => Promise<T>,
  retries: number = API_CONFIG.RETRY_CONFIG.MAX_RETRIES
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const apiError = error as ApiErrorResponse;
    if (apiError.request && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_CONFIG.RETRY_DELAY));
      return fetchWithRetry(apiCall, retries - 1);
    }
    throw error;
  }
};

export const getTopTechNews = async (page = 1): Promise<GuardianResponse> => {
  const params = {
    section: API_CONFIG.SECTIONS.TECHNOLOGY,
    page: page.toString(),
    'api-key': getApiKey(),
    'show-fields': API_CONFIG.DEFAULT_FIELDS.LIST,
  };

  const cacheKey = apiCache.generateKey('/search', params);
  const cachedData = apiCache.get<GuardianResponse>(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetchWithRetry(async () => {
      const { data } = await axiosInstance.get('/search', { params });
      return data;
    });

    apiCache.set(cacheKey, response);
    return response;
  } catch (error) {
    return handleApiError(error as ApiErrorResponse, 'Failed to fetch tech news');
  }
};

export const getArticleById = async (id: string): Promise<Article> => {
  const params = {
    'api-key': getApiKey(),
    'show-fields': API_CONFIG.DEFAULT_FIELDS.DETAIL,
  };

  const cacheKey = apiCache.generateKey(`/${id}`, params);
  const cachedData = apiCache.get<Article>(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetchWithRetry(async () => {
      const { data } = await axiosInstance.get(`/${id}`, { params });
      return data.response.content;
    });

    apiCache.set(cacheKey, response);
    return response;
  } catch (error) {
    return handleApiError(error as ApiErrorResponse, 'Failed to fetch article');
  }
};
