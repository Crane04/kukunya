const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const orgAuthRouter = require("./routes/organizations/authRouter");
const userAuthRouter = require("./routes/users/authRouter");
const db_url = process.env.DB_URL;
const port = process.env.PORT || 3000;
const cors = require('cors');

const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    return res.status(200).json({
        "message": "okay"
    })
})
app.use("/auth/organizations", orgAuthRouter);
app.use("/auth/user", userAuthRouter);

mongoose.connect(db_url)
    .then(() => {
        server.listen(port, () => {
            console.log("Server is running on port " + port);
        });
    })
    .catch((error) => {
        console.log(error);
    });

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Receiving latitude and longitude from the client
    socket.on('sendLocation', (data) => {
        const { latitude, longitude } = data;
        console.log(`Received location: ${latitude}, ${longitude}`);

        // You can process the location data here or broadcast it to other clients
        // For example, broadcasting to all connected clients except the sender
        socket.broadcast.emit('locationUpdate', { latitude, longitude });
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
