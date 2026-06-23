require('dotenv').config(); // Load .env variables
const express = require('express');

const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
{ id: 2, task: "Build CRUD API", completed: true },
{ id: 3, task: "Learn Express routing", completed: false },
{ id: 4, task: "Connect MongoDB database", completed: true },
{ id: 5, task: "Create authentication system", completed: false },
{ id: 6, task: "Add input validation", completed: true },
{ id: 7, task: "Handle errors with middleware", completed: false },
{ id: 8, task: "Test API with Postman", completed: true },
{ id: 9, task: "Deploy backend to server", completed: false },
{ id: 10, task: "Document API endpoints", completed: true }
];

//Validation middleware
const validateTodo = (req, res, next) => {
  const { task, completed } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  next();
};

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// POST New – Create
app.post('/todos',validateTodo, (req, res) => {
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

//GET Completed – Custom Read
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

// GET Incomplete – Custom Read
app.get('/todos/incomplete', (req, res) => {
  const incomplete = todos.filter((t) => !t.completed);
  res.json(incomplete); // Custom Read!
});

// GET Count – Custom Read
app.get('/todos/count', (req, res) => {
  const count = todos.length;
  res.json({ count }); // Custom Read!
});

// GET One – Read
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
})
;



// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT || 3000}`));
