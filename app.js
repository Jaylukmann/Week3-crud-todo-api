require('dotenv').config(); // Load .env variables
const express = require('express');
const connectDB = require('./config/db.js'); // Import DB connection
const Todo = require('./models/todoModel.js'); // Import Todo model
const path = require('path'); // Import path module for serving static files

// import cors for cross-origin requests
// const cors = require('cors');
const validateCreateTodo = require('./middlewares/validateCreateTodo.js');
const validateEditTodo = require('./middlewares/validateEditTodo.js');
const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));//use path to serve static files from the public folder
app.use(express.json()); // Parse JSON bodies
app.use(logger);//use logger middleware
connectDB(); //Connect to MongoDB database


// GET All – Read
app.get('/todos',async (req, res) => {
  try {
    const todos = await Todo.find();// Fetch all todos from the database
    res.status(200).json(todos); // Echo back todo from the db
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos',validateCreateTodo, async (req, res,next) => {
  try {
      const {task,completed}= new Todo(req.body)
      const newTodo = new Todo({ 
        task, 
        completed });
  await newTodo.save(); // Save to DB
  res.status(201).json(newTodo); // Echo back the new todo from the db
  } catch (error) {
    next(error);
  }
});

//GET Completed – Custom Read
app.get('/todos/completed',async (req, res,next) => {
  try {
    const todos = await Todo.find({ completed: true });
  res.json(todos); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// GET Incomplete – Custom Read
app.get('/todos/incomplete',async (req, res,next ) => {
  try {
    const incomplete = await Todo.find({ completed: false });
    res.json(incomplete); // Custom Read!
  } catch (error) {
  next(error);
  }
});

// GET Count – Custom Read
app.get('/todos/count',async (req, res,next ) => {   
  try {
    const count = await Todo.countDocuments();
    res.json({ count }); // Custom Read!
  } catch (error) {
    next(error);
  }
});

// GET One – Read
app.get('/todos/:id', async(req, res,next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) 
      return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch('/todos/:id',validateEditTodo, async (req, res,next) => {
  try {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,
     { new: true });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json({ message: `Todo ${todo.task} with ID ${req.params.id} updated successfully` });
  } catch (error) {
   next(error);
  }
});

// DELETE Remove Todo
app.delete('/todos/:id', async (req, res,next) => {
  try{
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json({ message: `Todo ${todo.task} with ID ${req.params.id} deleted successfully` });
  } catch (error) {
    next(error);
  }
});
  



// //use error handler middleware
 app.use(errorHandler);


// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT || 3000}`));
