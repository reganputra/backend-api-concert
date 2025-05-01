const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();


const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('PostgreSQL Terhubung');
        return prisma;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { prisma, connectDB };