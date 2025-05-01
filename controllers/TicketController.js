const {prisma} = require('../config/client')

const createTicket = async (req, res) => {
    try {
        const { concertId, quantity, seatNumbers } = req.body;

        // Check if concert exists
        const concert = await prisma.concert.findUnique({
            where: { id: parseInt(concertId) }
        });

        if (!concert) {
            return res.status(404).json({ message: 'Konser tidak ditemukan' });
        }

        // Check if enough tickets available
        if (concert.availableSeats < quantity) {
            return res.status(400).json({ message: 'Tiket tidak tersedia' });
        }

        const totalPrice = parseFloat(concert.ticketPrice) * quantity;

        // Create ticket using transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create ticket
            const ticket = await prisma.ticket.create({
                data: {
                    concertId: parseInt(concertId),
                    userId: req.user.id,
                    quantity: parseInt(quantity),
                    totalPrice,
                    seatNumbers: seatNumbers || []
                }
            });

            // Update available seats
            await prisma.concert.update({
                where: { id: parseInt(concertId) },
                data: { availableSeats: concert.availableSeats - quantity }
            });

            return ticket;
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                concert: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Tiket tidak ditemukan' });
        }

        // Check if the user is the ticket owner or an admin
        if (ticket.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Tidak diizinkan' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { userId: req.user.id },
            include: { concert: true }
        });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTicketToPaid = async (req, res) => {
    try {
        const { paymentId, transactionId } = req.body;

        // Check if ticket exists
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Tiket tidak ditemukan' });
        }

        // Check if the user is the ticket owner
        if (ticket.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Tidak diizinkan' });
        }

        // Update ticket
        const updatedTicket = await prisma.ticket.update({
            where: { id: parseInt(req.params.id) },
            data: {
                status: 'paid',
                paymentId,
                transactionId
            }
        });

        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const cancelTicket = async (req, res) => {
    try {
        // Check if ticket exists
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Tiket tidak ditemukan' });
        }

        // Check if the user is the ticket owner or an admin
        if (ticket.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Tidak diizinkan' });
        }

        if (ticket.status === 'cancelled') {
            return res.status(400).json({ message: 'Tiket sudah dibatalkan sebelumnya' });
        }

        // Update ticket and return available seats using transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Update ticket
            const updatedTicket = await prisma.ticket.update({
                where: { id: parseInt(req.params.id) },
                data: { status: 'cancelled' }
            });

            // Return available seats
            await prisma.concert.update({
                where: { id: ticket.concertId },
                data: {
                    availableSeats: {
                        increment: ticket.quantity
                    }
                }
            });

            return updatedTicket;
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                concert: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    getTicketById,
    getMyTickets,
    updateTicketToPaid,
    cancelTicket,
    getTickets
};