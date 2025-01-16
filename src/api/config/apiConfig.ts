export const API_CONFIG = {
  BASE_URL: 'https://content.guardianapis.com',
  DEFAULT_FIELDS: {
    LIST: 'thumbnail,trailText',
    DETAIL: 'thumbnail,trailText,body',
  },
  SECTIONS: {
    TECHNOLOGY: 'technology',
  },
  RETRY_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
  CACHE_CONFIG: {
    TTL: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export const getApiKey = (): string => {
  const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY;
  if (!apiKey) {
    throw new Error('Guardian API key is not configured');
  }
  return apiKey;
};
