require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET ,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION
};

