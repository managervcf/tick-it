const OrderIndex = ({ orders }) => {
  const orderList = orders.map(({ id, ticket, status }) => (
    <li key={id}>
      {ticket.title} - {status}
    </li>
  ));

  return (
    <ul>
      <h2>My orders</h2>
      {orderList}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');

  return { orders };
};

export default OrderIndex;
