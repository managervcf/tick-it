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

    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(`\n\n\n\nNODE ENVIRONMENT: ${process.env.NODE_ENV}\n\n\n\n`);

    return axios.create({
      baseURL: isDevelopment
        ? process.env.BASE_URL_DEVELOPMENT
        : process.env.BASE_URL_PRODUCTION,
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
