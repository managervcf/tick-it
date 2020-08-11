import Link from 'next/link';

const LandingPage = ({ tickets }) => {
  const ticketsData = tickets.map(({ id, title, price }) => (
    <tr key={id}>
      <td>{title}</td>
      <td>{price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
          <a>Details</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsData}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: tickets } = await client.get('/api/tickets');

  return { tickets };
};

export default LandingPage;
