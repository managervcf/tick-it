import axios from 'axios';
import { useState } from 'react';

/**
 * useRequest hook.
 *
 * @param   {string}    url        A url for the axios client.
 * @param   {string}    method     HTTP method.
 * @param   {object}    body       Data to send with the request.
 * @param   {Function}  onSuccess  Callback function.
 * @return  {Object}               { doRequest, errors }
 */
export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (properties = {}) => {
    try {
      // Reset errors state
      setErrors(null);

      // Send a request
      const response = await axios[method](url, {
        ...body,
        ...properties,
      });

      // Check if callback is provided and call it if so
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Return data from the request
      return response.data;
    } catch (error) {
      // Build a jsx error messages component
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  // Return doRequest and errors
  return { doRequest, errors };
};
