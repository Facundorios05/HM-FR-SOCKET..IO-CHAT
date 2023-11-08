import express from 'express'
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http'
const server = http.createServer(app);
import { Server } from 'socket.io'
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
let user
let message
let messages = [
]
io.on('connection', (socket) => {

    socket.on('new-user', (username) => {
        user = username
        console.log('Nuevo usuario conectado:', username);
    })

    socket.on('chat message', (data) => {
        let user = data.user
        let msg = data.message
        socket.broadcast.emit(user, msg);
        io.emit('chat message', { user, msg });
        message = msg
        messages.push({ user, message })
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

})
app.get('/api/messages', (req, res) => {
    res.json(messages)
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});