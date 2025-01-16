import { API_CONFIG } from '../config/apiConfig';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<unknown>> = new Map();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > API_CONFIG.CACHE_CONFIG.TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(path: string, params: Record<string, string | number | boolean>): string {
    const sortedParams = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `${path}?${sortedParams}`;
  }
}

export const apiCache = new ApiCache();
