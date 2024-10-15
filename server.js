const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

app.use(require("morgan")("dev"));
app.use(express.json());

app.post("/reservations", async (req, res, next) => {
  const { restaurantId, customerIds } = req.body;
  try {
    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(Date.now()).toDateString(),
        restaurantId: restaurantId,
        party: { connect: customerIds.map((id) => ({ id })) },
      },
      include: {
        party: true,
      },
    });
    res.status(201).json(reservation);
  } catch (e) {
    next(e);
  }
})

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
