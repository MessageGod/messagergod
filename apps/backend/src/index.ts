import express, { Express } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { authMiddleware, errorHandler } from './middleware/index.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import serversRoutes from './routes/servers.js';
import channelsRoutes from './routes/channels.js';
import dmsRoutes from './routes/dms.js';
import groupChatsRoutes from './routes/group-chats.js';
import messagesRoutes from './routes/messages.js';
import setupSocketHandlers from './services/socket.js';

import db from './database/index.js';
import redis from './services/redis.js';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== AUTH ROUTES =====
app.post('/api/auth/register', authRoutes);
app.post('/api/auth/login', authRoutes);
app.get('/api/auth/me', authMiddleware, authRoutes);
app.post('/api/auth/logout', authRoutes);

// ===== USERS ROUTES =====
app.get('/api/users/:userId', usersRoutes);
app.put('/api/users/:userId', authMiddleware, usersRoutes);
app.get('/api/users/search', usersRoutes);

// ===== SERVERS ROUTES =====
app.get('/api/servers', authMiddleware, serversRoutes);
app.post('/api/servers', authMiddleware, serversRoutes);
app.get('/api/servers/:serverId', authMiddleware, serversRoutes);
app.put('/api/servers/:serverId', authMiddleware, serversRoutes);
app.delete('/api/servers/:serverId', authMiddleware, serversRoutes);

// ===== CHANNELS ROUTES =====
app.get('/api/channels/:channelId/messages', authMiddleware, channelsRoutes);
app.post('/api/servers/:serverId/channels', authMiddleware, channelsRoutes);
app.put('/api/channels/:channelId', authMiddleware, channelsRoutes);
app.delete('/api/channels/:channelId', authMiddleware, channelsRoutes);

// ===== DIRECT MESSAGES ROUTES =====
app.get('/api/dms', authMiddleware, dmsRoutes);
app.post('/api/dms', authMiddleware, dmsRoutes);
app.get('/api/dms/:dmId/messages', authMiddleware, dmsRoutes);

// ===== GROUP CHATS ROUTES =====
app.get('/api/group-chats', authMiddleware, groupChatsRoutes);
app.post('/api/group-chats', authMiddleware, groupChatsRoutes);
app.get('/api/group-chats/:groupChatId', authMiddleware, groupChatsRoutes);
app.get('/api/group-chats/:groupChatId/messages', authMiddleware, groupChatsRoutes);
app.post('/api/group-chats/:groupChatId/members', authMiddleware, groupChatsRoutes);
app.delete('/api/group-chats/:groupChatId/members/:userId', authMiddleware, groupChatsRoutes);

// ===== MESSAGES ROUTES =====
app.post('/api/messages', authMiddleware, messagesRoutes);
app.put('/api/messages/:messageId', authMiddleware, messagesRoutes);
app.delete('/api/messages/:messageId', authMiddleware, messagesRoutes);

// Error handler
app.use(errorHandler);

// Setup Socket.IO handlers
setupSocketHandlers();

// Start server
const PORT = process.env.BACKEND_PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Redis
    await redis.connect();
    console.log('✓ Redis connected');

    // Check database connection
    await db.raw('SELECT 1');
    console.log('✓ Database connected');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ WebSocket server ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
