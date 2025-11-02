// Express and Prisma setup
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// CRUD endpoints for Room
app.get('/api/rooms', async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

app.get('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const room = await prisma.room.findUnique({ where: { id: Number(id) } });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

app.post('/api/rooms', async (req, res) => {
  const { name, numberOfPersons } = req.body;
  const room = await prisma.room.create({
    data: { name, numberOfPersons }
  });
  res.status(201).json(room);
});

app.put('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { name, numberOfPersons } = req.body;
  const room = await prisma.room.update({
    where: { id: Number(id) },
    data: { name, numberOfPersons }
  });
  res.json(room);
});

app.delete('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.room.delete({ where: { id: Number(id) } });
  res.json({ message: `Room with id ${id} deleted successfully.` });
});

// Vercel compatibility
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
