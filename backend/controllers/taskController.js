const Task = require('../models/Task');

// @route  POST /api/tasks
// @access Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/tasks
// @access Private
const getTasks = async (req, res, next) => {
  try {
    // Only return tasks owned by the logged-in user
    const tasks = await Task.find({ user: req.user._id }).sort({ createdDate: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/tasks/:id
// @access Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Ownership check — a logged-in user must not be able to view another user's task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task.' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Ownership check — this is the exact check the AI-generated version initially missed
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task.' });
    }

    const { title, description, dueDate, priority, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Ownership check before deletion
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
