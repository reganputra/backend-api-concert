const {prisma} = require('../config/client')

const getConcerts = async (req, res) => {
    try {
        const concerts = await prisma.concert.findMany();
        res.json(concerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getConcertById = async (req, res) => {
    try {
        const concert = await prisma.concert.findUnique({
            where: { id: req.params.id }
        });

        if (!concert) {
            return res.status(404).json({ message: 'Konser tidak ditemukan' });
        }

        res.json(concert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createConcert = async (req, res) => {
    try {
        const { title, artist, date, venue, totalSeats, ticketPrice, image, description, categories } = req.body;

        const concert = await prisma.concert.create({
            data: {
                title,
                artist,
                date: new Date(date),
                venue,
                totalSeats: parseInt(totalSeats),
                availableSeats: parseInt(totalSeats),
                ticketPrice: parseFloat(ticketPrice),
                image,
                description,
                categories
            }
        });

        res.status(201).json(concert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateConcert = async (req, res) => {
    try {
        const { title, artist, date, venue, ticketPrice, image, description, categories } = req.body;

        // Check if concert exists
        const concertExists = await prisma.concert.findUnique({
            where: { id: req.params.id }
        });

        if (!concertExists) {
            return res.status(404).json({ message: 'Konser tidak ditemukan' });
        }

        // Update concert
        const updatedConcert = await prisma.concert.update({
            where: { id: req.params.id },
            data: {
                title: title || concertExists.title,
                artist: artist || concertExists.artist,
                date: date ? new Date(date) : concertExists.date,
                venue: venue || concertExists.venue,
                ticketPrice: ticketPrice ? parseFloat(ticketPrice) : concertExists.ticketPrice,
                image: image || concertExists.image,
                description: description || concertExists.description,
                categories: categories || concertExists.categories
            }
        });

        res.json(updatedConcert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteConcert = async (req, res) => {
    try {
        // Check if concert exists
        const concertExists = await prisma.concert.findUnique({
            where: { id: req.params.id }
        });

        if (!concertExists) {
            return res.status(404).json({ message: 'Konser tidak ditemukan' });
        }

        // Delete concert
        await prisma.concert.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Konser berhasil dihapus', data: concertExists });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getConcerts,
    getConcertById,
    createConcert,
    updateConcert,
    deleteConcert
};