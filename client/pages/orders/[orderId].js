import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request';
import Router from 'next/router';

const OrderDetails = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  const onToken = ({ id }) => doRequest({ token: id });

  if (timeLeft <= 0) {
    return <div>Order has expired</div>;
  }

  return (
    <div>
      You have {timeLeft} seconds left to pay
      <StripeCheckout
        token={onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data: order } = await client.get(`/api/orders/${orderId}`);

  return { order };
};

export default OrderDetails;
