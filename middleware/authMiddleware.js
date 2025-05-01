const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {prisma} = require('../config/client')

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
        try {
            // Get token directly from authorization header
            token = req.headers.authorization;

            // Verify token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Get user from token
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isAdmin: true,
                    phone: true
                }
            });

            next();
        } catch (error) {
            res.status(401).json({ message: 'Tidak diizinkan, token tidak valid' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak diizinkan, tidak ada token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Tidak diizinkan, bukan admin' });
    }
};

module.exports = { protect, admin };