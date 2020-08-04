/**
 * Custom App component.
 *
 * A file that gets executed for every page of the app.
 * Included bootstrap will apply to all pages.
 */
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

/**
 * Function used for fetching data about current user before
 * rendering process.
 *
 * @name              getInitialProps Function executed before SSR.
 * @param   {Object}  appContext      All props.
 * @return  {Object}                  Object set as props for the component.
 */
AppComponent.getInitialProps = async appContext => {
  // Build client (preconfigured axios client)
  const axiosClient = buildClient(appContext.ctx);
  // Make a request to check if user is logged in
  const { data } = await axiosClient.get('/api/users/currentuser');

  //
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
