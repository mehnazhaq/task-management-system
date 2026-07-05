const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // every route below requires a valid JWT

router.route('/').post(createTask).get(getTasks);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
