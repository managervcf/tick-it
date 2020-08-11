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
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
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
