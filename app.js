require('dotenv').config(); // Load .env variables
const express = require('express');

// import cors for cross-origin requests
// const cors = require('cors');
const validateCreateTodo = require('./middlewares/validateCreateTodo.js');
const validateEditTodo = require('./middlewares/validateEditTodo.js');
const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

//use path to serve static files from the public folder
app.use(express.static("public"));

app.use(express.json()); // Parse JSON bodies

//use logger middleware
 app.use(logger);


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


// GET All – Read
app.get('/todos', (req, res) => {
  try {
    res.status(200).json(todos); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos',validateCreateTodo, (req, res,next) => {
  try {
      const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);
  }
});

//GET Completed – Custom Read
app.get('/todos/completed', (req, res,next) => {
  try {
     const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// GET Incomplete – Custom Read
app.get('/todos/incomplete', (req, res,next ) => {
  try {
    const incomplete = todos.filter((t) => !t.completed);
    res.json(incomplete); // Custom Read!
  } catch (error) {
  next(error);
  }
});

// GET Count – Custom Read
app.get('/todos/count', (req, res,next ) => {   
  try {
    const count = todos.length;
    res.json({ count }); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// GET One – Read
app.get('/todos/:id', (req, res,next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch('/todos/:id',validateEditTodo, (req, res,next) => {
  try {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
  } catch (error) {
   next(error);
  }
});

// DELETE Remove Todo
app.delete('/todos/:id', (req, res,next) => {
  try{
    const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
  } catch (error) {
    next(error);
  }
});



// //use error handler middleware
 app.use(errorHandler);


// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT || 3000}`));
