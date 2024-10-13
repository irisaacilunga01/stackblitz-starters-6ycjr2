require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { sequelize, User, Group, Message } = require('./models');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on('join', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leave', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('chatMessage', async (message) => {
    try {
      const newMessage = await Message.create({
        content: message.content,
        UserId: message.userId,
        GroupId: message.groupId
      });

      if (message.groupId) {
        io.to(`group_${message.groupId}`).emit('message', newMessage);
      } else if (message.recipientId) {
        io.to(`user_${message.recipientId}`).emit('message', newMessage);
        io.to(`user_${message.userId}`).emit('message', newMessage);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

const PORT = process.env.PORT || 3010;

sequelize.sync().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  });
});