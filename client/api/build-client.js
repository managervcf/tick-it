import axios from 'axios';

/**
 * Build axios client for requests issued from
 * both browser and server.
 *  */
export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    /**
     * Axios client for the server.
     */

    // Build base URL depending on environment
    const baseURL =
      process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL_PROD
        : process.env.BASE_URL_DEV;

    return axios.create({
      baseURL,
      headers: req.headers,
    });
  } else {
    /**
     * Axios client for the browser.
     */
    return axios.create({
      baseURL: '/',
    });
  }
};
