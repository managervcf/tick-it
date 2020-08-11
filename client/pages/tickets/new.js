import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const NewTicket = ({ currentUser, client }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = e => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={price}
            onChange={e => setPrice(e.target.value)}
            onBlur={onBlur}
          ></input>
        </div>
        {errors}
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};

export default NewTicket;
