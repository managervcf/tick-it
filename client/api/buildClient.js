import axios from 'axios';

/**
 * Build axios client for requests issued from
 * both browser and server.
 *  */
export default ({ req }) => {
  if (typeof window === 'undefined') {
    /**
     * Axios client for the server.
     */
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
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
