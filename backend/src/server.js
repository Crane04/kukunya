const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const issueRoutes = require('./routes/issues/issuesRouter');
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const orgAuthRouter = require("./routes/organizations/authRouter");
const userAuthRouter = require("./routes/users/authRouter");
const db_url = process.env.DB_URL;
const port = process.env.PORT || 3000;
const app_sk = process.env.APP_SK;
const cors = require('cors');

const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cookieParser(app_sk));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    return res.status(200).json({
        "message": "okay"
    });
});
app.use('/issues', issueRoutes);
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


    io.on('connection', (socket) => {
        console.log('New client connected');
    
        socket.on('sendLocation', (data) => {
            const { latitude, longitude, type, user } = data;
            const time = Date.now(); // Ensure you are using the correct time format
            socket.broadcast.emit('locationUpdate', { location: { latitude, longitude }, type, user, time });
        });
    
        // Handling the respondToEmergency event
        socket.on('respondToEmergency', (data) => {
            console.log(`Received response to emergency: ${data.emergencyId}`);
    
            // Broadcasting to all clients that help is on the way
            io.emit('helpOnTheWay', { emergencyId: data.emergencyId });
        });
    
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    