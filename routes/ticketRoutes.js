const express = require('express');
const router = express.Router();
const {
    createTicket,
    getTicketById,
    getMyTickets,
    updateTicketToPaid,
    cancelTicket,
    getTickets
} = require('../controllers/TicketController');
const {protect, admin} = require('../middleware/authMiddleware');

// Protected public routes
router.post('/', protect, createTicket);
router.get('/mytickets', protect, getMyTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id/pay', protect, updateTicketToPaid);
router.delete('/:id/cancel', protect, cancelTicket);

// Admin routes
router.get('/', protect, admin, getTickets);

module.exports = router;