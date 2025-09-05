import { createClient } from 'contentful';
import config from '../clientConfig';

const useContentful = () => {
  const { contentfulSpaceId, contentfulAccessToken } = config;

  if (contentfulSpaceId && contentfulAccessToken) {
    try {
      const client = createClient({
        space: contentfulSpaceId,
        accessToken: contentfulAccessToken,
      });
      return client;
    } catch (err) {
      console.error('Failed to create Contentful client:', err);
    }
  }

  // Fallback no-op client to avoid runtime errors when Contentful credentials are not provided
  return {
    getEntries: async () => ({ items: [] }),
    getEntry: async () => null,
  };
};

export default useContentful;
