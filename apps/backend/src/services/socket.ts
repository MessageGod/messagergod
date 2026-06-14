import { io } from '../index.js';
import db from '../database/index.js';
import jwt from 'jsonwebtoken';
import { Session } from '../types/index.js';

export function setupSocketHandlers() {
  io.on('connection', (socket) => {
    console.log('✓ User connected:', socket.id);

    // Authentication
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.AUTH_SECRET || 'secret') as Session;
      userId = decoded.user.id;
    } catch (error) {
      socket.disconnect();
      return;
    }

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Set user online status
    (async () => {
      try {
        await db('users').where({ id: userId }).update({ status: 'online' });
        io.emit('user:online', { userId, status: 'online' });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    })();

    // ===== PRESENCE EVENTS =====

    // User status change
    socket.on('presence:status', async (data) => {
      try {
        const { status } = data;
        if (!['online', 'idle', 'dnd', 'offline'].includes(status)) {
          return;
        }

        await db('users').where({ id: userId }).update({ status });
        io.emit('user:status', { userId, status });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    });

    // ===== TYPING INDICATORS =====

    // Typing start
    socket.on('typing:start', (data) => {
      const { channelId, directMessageId, groupChatId } = data;

      let room = '';
      if (channelId) room = `channel:${channelId}`;
      else if (directMessageId) room = `dm:${directMessageId}`;
      else if (groupChatId) room = `group:${groupChatId}`;

      if (room) {
        socket.to(room).emit('typing:start', { userId });
      }
    });

    // Typing stop
    socket.on('typing:stop', (data) => {
      const { channelId, directMessageId, groupChatId } = data;

      let room = '';
      if (channelId) room = `channel:${channelId}`;
      else if (directMessageId) room = `dm:${directMessageId}`;
      else if (groupChatId) room = `group:${groupChatId}`;

      if (room) {
        socket.to(room).emit('typing:stop', { userId });
      }
    });

    // ===== CHANNEL/ROOM EVENTS =====

    // Join channel
    socket.on('channel:join', (data) => {
      const { channelId } = data;
      socket.join(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('member:joined', { userId });
    });

    // Leave channel
    socket.on('channel:leave', (data) => {
      const { channelId } = data;
      socket.leave(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('member:left', { userId });
    });

    // Join DM
    socket.on('dm:join', (data) => {
      const { dmId } = data;
      socket.join(`dm:${dmId}`);
    });

    // Leave DM
    socket.on('dm:leave', (data) => {
      const { dmId } = data;
      socket.leave(`dm:${dmId}`);
    });

    // Join group chat
    socket.on('group:join', (data) => {
      const { groupChatId } = data;
      socket.join(`group:${groupChatId}`);
      socket.to(`group:${groupChatId}`).emit('member:joined', { userId });
    });

    // Leave group chat
    socket.on('group:leave', (data) => {
      const { groupChatId } = data;
      socket.leave(`group:${groupChatId}`);
      socket.to(`group:${groupChatId}`).emit('member:left', { userId });
    });

    // ===== DISCONNECT =====

    socket.on('disconnect', async () => {
      console.log('✗ User disconnected:', socket.id);

      try {
        await db('users').where({ id: userId }).update({ status: 'offline' });
        io.emit('user:offline', { userId, status: 'offline' });
      } catch (error) {
        console.error('Error updating disconnect status:', error);
      }
    });
  });
}

export default setupSocketHandlers;
