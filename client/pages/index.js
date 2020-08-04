import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => (
  <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>
);

/**
 * Function used for fetching data about current user before
 * rendering process.
 *
 * @name              getInitialProps Function executed before SSR.
 * @param   {Object}  context         Object with 'req' property.
 * @return  {Object}                  Object set as props for the component.
 */
LandingPage.getInitialProps = async context => {
  // Build client (preconfigured axios client)
  const axiosClient = buildClient(context);
  // Make a request to check if user is logged in
  const { data } = await axiosClient.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
