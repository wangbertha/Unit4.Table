const prisma = require("../prisma");

const seed = async (numRestaurants, numCustomers, numReservations) => {
  const restaurants = Array.from({ length: numRestaurants }, (_, i) => ({
    name: `Restaurant ${i+1}`,
  }));
  await prisma.restaurant.createMany({ data: restaurants });
  const customers = Array.from({ length: numCustomers }, (_, i) => ({
    name: `Customer ${i+1}`,
    email: `email${i+1}@email.com`,
  }));
  await prisma.customer.createMany({ data: customers });
  for (let i=0; i<numReservations; i++) {
    const partyLength = Math.floor(Math.random() * numCustomers) + 1;
    const party = Array.from({ length: partyLength }, () => ({
      id: Math.floor(Math.random() * numCustomers) + 1,
    }));
    const restaurantId = Math.floor(Math.random() * numRestaurants) + 1;
    await prisma.reservation.create({
      data: {
        date: new Date(Date.now()).toDateString(),
        restaurantId: restaurantId,
        party: { connect: party },
      },
    });
  }
};

seed(3, 5, 8)
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
