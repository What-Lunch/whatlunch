export const getApiBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || process.env.BASE_URL;

  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[API] API base URL environment variable is not defined.');
    }
    return 'http://localhost:8080';
  }
  return url;
};
