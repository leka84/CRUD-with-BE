// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let users = [
  { id: "1", firstName: "Pera", lastName: "Peric", email: "pera@example.com", phone: "123456789" },
  { id: "2", firstName: "Laza", lastName: "Jovanovic", email: "john@example.com" },
  { id: "3", firstName: "Jana", lastName: "Maricic", email: "jane@example.com", phone: "987654321" },
  { id: "4", firstName: "Mika", lastName: "Mikic", email: "mika@example.com", phone: "987654321" }
];

let nextId = 5;

app.get('/api/users', (req, res) => res.json(users));

app.post('/api/users', (req, res) => {
  const user = { id: String(nextId++), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.map(u => u.id === id ? { ...u, ...req.body } : u);
  res.json(users.find(u => u.id === id));
});

app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend running → http://localhost:${PORT}/api/users`);
});