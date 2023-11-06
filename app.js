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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
let messages = []
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('chat message', (msg) => {
        socket.broadcast.emit(msg);

        messages.push(msg);
        io.emit('chat message', msg);
        console.log(messages)
    });



    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

})
app.get('/api/messages', () => {
    return messages;
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});