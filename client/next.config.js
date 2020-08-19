module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    STRIPE_PUBLISHABLE_KEY: 'pk_test_81H4eK5SeZQvQn6Zkw03z78b',
    BASE_URL_DEV:
      'http://ingress-nginx-controller.kube-system.svc.cluster.local',
    BASE_URL_PROD: 'http://www.application-production.xyz',
  },
};
