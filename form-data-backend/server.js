const express = require('express');
const cors = require('cors');
const Routes = require('../form-data-backend/routes/auth.routes');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const db = require('./config/db'); // Ensure this path and file exist

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hi i m backend ");
});

io.on('connection', (socket) => {
    console.log('A USER IS CONNECTED');

    socket.on('message', (msg) => {
        console.log('Received Message:', msg);
        io.emit('message', msg);
    });

    socket.on('update-profile-socket', (data) => {
        const { id, email, address, designation, dob, phone } = data;

        const query = `
            INSERT INTO user_details (id, email, address, designation, dob, phone)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                email = VALUES(email),
                address = VALUES(address),
                designation = VALUES(designation),
                dob = VALUES(dob),
                phone = VALUES(phone)
        `;

        db.query(query, [id, email, address, designation, dob, phone], (err, result) => {
            if (err) {
                console.error('Database error during socket update:', err);
                socket.emit('update-profile-response', { success: false, message: 'Update failed' });
            } else {
                console.log('Socket-based profile updated successfully');
                socket.emit('update-profile-response', { success: true, message: 'Profile updated' });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user Disconnected');
    });
}); // ✅ This was missing in your original code

app.use('/use', Routes);

server.listen(3333, () => console.log("server is on at port 3333"));
