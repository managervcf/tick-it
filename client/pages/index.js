import Link from 'next/link';

const LandingPage = ({ tickets }) => {
  console.log(tickets);
  const ticketsData = tickets.map(({ id, title, price }) => (
    <div className="card m-4 pt-2">
      <div className="row no-gutters">
        <div className="col-md-4">
          <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <span className="card-text">{new Date().toDateString()}</span>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card-body">
            <h3 className="text-right">${price}</h3>
            <p className="text-right">
              <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
                <a href="#" className="btn btn-primary">
                  Buy
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <h2 className="heading text-center">Tickets for sale</h2>
      {ticketsData}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data: tickets } = await client.get('/api/tickets');

  return { tickets };
};

export default LandingPage;
