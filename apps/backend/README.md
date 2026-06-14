# MessageGod Backend - README

## 🚀 Quick Start

```bash
# Install & setup
cd apps/backend
npm install
docker-compose up -d
npm run db:migrate
npm run db:seed

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

## 📚 Documentation

- **[API Reference](docs/API_COMPLETE.md)** - Complete API documentation
- **[Testing Guide](TESTING.md)** - Test scenarios and commands
- **[Deployment Guide](../docs/DEPLOYMENT_RENDER.md)** - Deploy to Render
- **[Testing & Deployment](../docs/TESTING_DEPLOYMENT.md)** - Full testing & deployment

## 🏗️ Architecture

```
Express.js Server
├── REST API (20+ routes)
├── Socket.IO WebSocket
├── PostgreSQL Database
├── Redis Cache
└── JWT Authentication
```

## 📂 Project Structure

```
src/
├── index.ts              Main server & routes
├── database/
│   ├── index.ts          Database connection
│   ├── migrations/       Schema definitions
│   └── seeds/            Test data
├── routes/               API endpoints
├── middleware/           Auth & error handling
├── services/             Redis & Socket.IO
└── types/                TypeScript interfaces
```

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm run start            # Run production build
npm run type-check       # Check TypeScript

# Database
npm run db:migrate       # Run migrations
npm run db:rollback      # Undo migrations
npm run db:seed          # Add test data
npm run db:reset         # Clean database

# Docker
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

## 🔌 API Endpoints

### Authentication (4)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users (3)
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users/search` - Search users

### Servers (5)
- `GET /api/servers` - List servers
- `POST /api/servers` - Create server
- `GET /api/servers/:id` - Get server details
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server

### Channels (4)
- `GET /api/channels/:id/messages` - Get messages
- `POST /api/servers/:id/channels` - Create channel
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel

### Direct Messages (3)
- `GET /api/dms` - List DMs
- `POST /api/dms` - Create DM
- `GET /api/dms/:id/messages` - Get messages

### Group Chats (6)
- `GET /api/group-chats` - List group chats
- `POST /api/group-chats` - Create group chat
- `GET /api/group-chats/:id` - Get details
- `GET /api/group-chats/:id/messages` - Get messages
- `POST /api/group-chats/:id/members` - Add member
- `DELETE /api/group-chats/:id/members/:uid` - Remove member

### Messages (3)
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

## 🔌 Socket.IO Events

### Presence
- `presence:status` - Update user status
- `user:online` / `user:offline` - User status broadcasts

### Typing
- `typing:start` / `typing:stop` - Typing indicators

### Rooms
- `channel:join` / `channel:leave`
- `dm:join` / `dm:leave`
- `group:join` / `group:leave`

### Messages
- `message:new` - New message broadcast
- `message:updated` - Message edit broadcast
- `message:deleted` - Message delete broadcast

## 🗄️ Database

8 tables:
- `users` - User accounts
- `direct_messages` - DM conversations
- `group_chats` - Group chats
- `group_chat_members` - Group membership
- `servers` - Communities
- `server_members` - Server membership
- `channels` - Server channels
- `messages` - All messages (polymorphic)

## 🔐 Environment Variables

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AUTH_SECRET=your-secret-key
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

```bash
# Start backend
npm run dev

# In another terminal, test endpoints
curl http://localhost:3000/health

# See TESTING.md for full test scenarios
```

## 📦 Dependencies

- **express** - Web framework
- **socket.io** - Real-time WebSockets
- **postgres** - Database
- **redis** - Caching
- **knex** - Query builder & migrations
- **jsonwebtoken** - Authentication
- **bcrypt** - Password hashing
- **typescript** - Type safety

## 🚀 Deployment

Deploy to Render in 5 minutes:
1. Create PostgreSQL database
2. Create Redis instance
3. Create Web Service pointing to GitHub
4. Set environment variables
5. Run `npm run db:migrate`

See [DEPLOYMENT_RENDER.md](../docs/DEPLOYMENT_RENDER.md) for detailed steps.

## 📊 Features Implemented

✅ User authentication (JWT)
✅ User profiles & search
✅ Servers & channels
✅ Direct messaging
✅ Group chats
✅ Message CRUD
✅ Real-time updates (Socket.IO)
✅ User presence
✅ Typing indicators
✅ Database migrations
✅ Error handling
✅ CORS & security

## 🗺️ Roadmap

Phase 2:
- [ ] Message reactions
- [ ] Message pinning
- [ ] Threads
- [ ] File uploads

Phase 3:
- [ ] Voice/Video calls
- [ ] Screen sharing

Phase 4:
- [ ] AI features
- [ ] Moderation tools
- [ ] Analytics

## 📞 Support

### Common Issues

**Port 3000 already in use**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection refused**
```bash
docker-compose up -d postgres
```

**Redis connection failed**
```bash
docker-compose up -d redis
```

See [TESTING_DEPLOYMENT.md](../docs/TESTING_DEPLOYMENT.md) for more troubleshooting.

## 📄 License

MIT

---

**Status: ✅ Production Ready**

Backend is fully tested and ready for deployment!
