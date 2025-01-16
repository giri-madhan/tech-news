import { apiCache } from '../apiCache';
import { API_CONFIG } from '../../config/apiConfig';

describe('ApiCache', () => {
  beforeEach(() => {
    apiCache.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData);

      const cachedData = apiCache.get('test-key');
      expect(cachedData).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = apiCache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should expire cache after TTL', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData);

      // Move time forward past TTL
      jest.advanceTimersByTime(API_CONFIG.CACHE_CONFIG.TTL + 1000);

      const cachedData = apiCache.get('test-key');
      expect(cachedData).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove all cached items', () => {
      apiCache.set('key1', 'value1');
      apiCache.set('key2', 'value2');

      apiCache.clear();

      expect(apiCache.get('key1')).toBeNull();
      expect(apiCache.get('key2')).toBeNull();
    });
  });

  describe('generateKey', () => {
    it('should generate consistent keys for same path and params', () => {
      const path = '/api/news';
      const params = { page: 1, category: 'tech' };

      const key1 = apiCache.generateKey(path, params);
      const key2 = apiCache.generateKey(path, { ...params });

      expect(key1).toBe(key2);
    });

    it('should sort params alphabetically', () => {
      const path = '/api/news';
      const params1 = { z: 1, a: 2 };
      const params2 = { a: 2, z: 1 };

      const key1 = apiCache.generateKey(path, params1);
      const key2 = apiCache.generateKey(path, params2);

      expect(key1).toBe(key2);
    });

    it('should handle different types of param values', () => {
      const path = '/api/news';
      const params = {
        page: 1,
        active: true,
        category: 'tech',
      };

      const key = apiCache.generateKey(path, params);
      expect(key).toBe('/api/news?active=true&category=tech&page=1');
    });
  });
});
