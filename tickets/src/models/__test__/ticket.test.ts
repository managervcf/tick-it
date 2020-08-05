import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async done => {
  const [title, price, userId] = ['Concert Test', 5, '123'];

  // Create an instance of a ticket
  const ticket = Ticket.build({ title, price, userId });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice and save it as two separate variables
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make changes to both tickets
  firstInstance!.set({ price: 10 });
  firstInstance!.set({ price: 15 });

  // Save the first ticket and expect a success
  await firstInstance!.save();

  // Save the second ticket and expect a failure
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error(
    'Should not reach this point. Outdated ticket was saved to the database successfully'
  );
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({ title: 'sadfsadf', price: 3, userId: '123' });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
