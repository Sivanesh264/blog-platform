const express = require('express');
const { body } = require('express-validator');
const { createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/:postId',
  protect,
  [
    body('text')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment must be between 1 and 1000 characters'),
  ],
  createComment
);

router.delete('/:postId/:commentId', protect, deleteComment);

module.exports = router;
