const express = require('express');
const router = express.Router();
const {
    getConcerts,
    getConcertById,
    createConcert,
    updateConcert,
    deleteConcert
} = require('../controllers/ConcertController');
const {protect, admin} = require('../middleware/authMiddleware');

// Public routes
router.get('/', getConcerts);
router.get('/:id', getConcertById);

// Protected admin routes
router.post('/', protect, admin, createConcert);
router.put('/:id', protect, admin, updateConcert);
router.delete('/:id', protect, admin, deleteConcert);

module.exports = router;