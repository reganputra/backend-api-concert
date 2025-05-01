const express = require('express');
const {connectDB} = require('./config/client');
const concertRoutes = require('./routes/concertRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const errorHandler = require('./middleware/errorHandler');




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB()
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Routes
app.use('/api/concert', concertRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/user', userRoutes);

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})