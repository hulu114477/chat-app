//server/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'] 
  }
});

app.use(express.json());
app.use(cors());

const rooms = {};

class Room {
  constructor(name, pwd = '') {
    this.id = nanoid();
    this.name = name;
    this.pwd = pwd;
    this.users = [];
    this.messages = [];
  }
  
  addUser(user) {
    if (this.users.find(u => u.username === user.username)) {
      throw new Error('Username already exists in the room');
    }
    this.users.push({...user, socketId: user.socketId});
  }

  removeUser(username) {
    this.users = this.users.filter(u => u.username !== username);
  }
}

// API Routes
app.get('/api/rooms/count', (req, res) => {
  res.json({ data: Object.keys(rooms).length });
});

app.get('/api/rooms', (req, res) => {
  res.json({ data: Object.values(rooms).map(room => ({
    id: room.id,
    name: room.name,
    users: room.users.length
  })) });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create Room
  socket.on('createRoom', ({ name, username, color, pwd }, callback) => {
    console.log(`Create room request: Name=${name}, Username=${username}`);
    try {
      const room = new Room(name, pwd);
      rooms[room.id] = room;
      room.addUser({ username, color, socketId: socket.id });
      socket.join(room.id);
      callback({ 
        success: true, 
        room: {
          id: room.id,
          name: room.name,
          members: room.users
        } 
      });
      io.to(room.id).emit('memberUpdate', room.users);
    } catch (err) {
      callback({ error: err.message });
    }
  });

  // Join Room
  socket.on('joinRoom', ({ roomId, username, color, pwd }, callback) => {
    const room = rooms[roomId];
    if (!room) return callback({ error: 'Room not found' });
    
    try {
      room.addUser({ username, color, socketId: socket.id });
      socket.join(roomId);
      callback({ 
        success: true,
        room: {
          id: room.id,
          name: room.name,
          members: room.users
        }
      });
      io.to(roomId).emit('memberUpdate', room.users);
    } catch (err) {
      callback({ error: err.message });
    }
  });

  // Chat Message
  socket.on('chatMessage', ({ roomId, message }) => {
    const room = rooms[roomId];
    if (!room) return;
    
    const user = room.users.find(u => u.socketId === socket.id);
    const newMessage = {
      username: user.username,
      color: user.color,
      message,
      time: new Date().toISOString()
    };
    
    room.messages.push(newMessage);
    io.to(roomId).emit('message', newMessage);
  });

  // Disconnect
  socket.on('disconnect', () => {
    Object.values(rooms).forEach(room => {
      const user = room.users.find(u => u.socketId === socket.id);
      if (user) {
        room.removeUser(user.username);
        io.to(room.id).emit('memberUpdate', room.users);
      }
    });
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});