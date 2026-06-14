# MessageGod Backend Testing

## Quick Start

```bash
cd apps/backend

# One-time setup
chmod +x setup.sh
./setup.sh

# Or manual setup
npm install
docker-compose up -d
npm run db:migrate
npm run db:seed

# Start the server
npm run dev
```

## API Health Check

Test if the backend is working:

```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

## Test Scenarios

### Scenario 1: Full User Flow

```bash
# 1. Register a user
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "username": "alice",
    "password": "password123",
    "displayName": "Alice"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/me

# 3. Create a server
SERVER_ID=$(curl -s -X POST http://localhost:3000/api/servers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dev Community",
    "description": "For developers"
  }' | jq -r '.id')

echo "Server ID: $SERVER_ID"

# 4. Get server details
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/servers/$SERVER_ID

# 5. Send a message to the general channel
CHANNEL_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/servers/$SERVER_ID | jq -r '.channels[0].id')

curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"channelId\": \"$CHANNEL_ID\",
    \"content\": \"Hello everyone! 👋\"
  }"
```

### Scenario 2: Direct Messaging

```bash
# Register second user
TOKEN2=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "username": "bob",
    "password": "password123",
    "displayName": "Bob"
  }' | jq -r '.token')

# Get Bob's ID
BOB_ID=$(curl -s -H "Authorization: Bearer $TOKEN2" \
  http://localhost:3000/api/auth/me | jq -r '.id')

# Alice creates DM with Bob
DM_ID=$(curl -s -X POST http://localhost:3000/api/dms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$BOB_ID\"
  }" | jq -r '.id')

# Send message
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"directMessageId\": \"$DM_ID\",
    \"content\": \"Hey Bob, how are you doing?\"
  }"

# Get messages
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/dms/$DM_ID/messages"
```

### Scenario 3: Group Chat

```bash
# Get Alice and Bob's IDs
ALICE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/me | jq -r '.id')

# Alice creates group chat with Bob
GROUP_ID=$(curl -s -X POST http://localhost:3000/api/group-chats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Project Planning\",
    \"memberIds\": [\"$BOB_ID\"]
  }" | jq -r '.id')

# Send group message
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"groupChatId\": \"$GROUP_ID\",
    \"content\": \"Let's plan our project!\"
  }"

# Get group chat details
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/group-chats/$GROUP_ID

# Get messages
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/group-chats/$GROUP_ID/messages"
```

### Scenario 4: Message Editing & Deletion

```bash
# Send a message
MESSAGE=$(curl -s -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"channelId\": \"$CHANNEL_ID\",
    \"content\": \"This message has a typo\"
  }")

MESSAGE_ID=$(echo $MESSAGE | jq -r '.id')

# Edit message
curl -X PUT http://localhost:3000/api/messages/$MESSAGE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This message has been corrected ✓"
  }'

# Delete message
curl -X DELETE http://localhost:3000/api/messages/$MESSAGE_ID \
  -H "Authorization: Bearer $TOKEN"
```

## WebSocket Testing

Create a test file `ws-test.js`:

```javascript
import { io } from 'socket.io-client';

const token = process.argv[2];
if (!token) {
  console.error('Usage: node ws-test.js <token>');
  process.exit(1);
}

const socket = io('http://localhost:3000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('✓ Connected to WebSocket');
  
  // Test presence
  socket.emit('presence:status', { status: 'online' });
});

socket.on('user:online', (data) => {
  console.log('👤 User online:', data);
});

socket.on('user:offline', (data) => {
  console.log('👤 User offline:', data);
});

socket.on('message:new', (data) => {
  console.log('💬 New message:', data);
});

socket.on('typing:start', (data) => {
  console.log('✏️  User typing:', data);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

socket.on('disconnect', () => {
  console.log('✗ Disconnected');
  process.exit(0);
});

// Keep connection open
setTimeout(() => {
  socket.disconnect();
}, 10000);
```

Run it:

```bash
npm install socket.io-client
node ws-test.js <your-token>
```

## Database Inspection

View what's in your database:

```bash
# Connect to PostgreSQL
psql postgresql://messagergod:dev_password@localhost:5432/messagergod_dev

# View users
SELECT id, username, display_name, status FROM users;

# View messages
SELECT id, sender_id, content, created_at FROM messages;

# View servers
SELECT id, name, owner_id FROM servers;

# View channels
SELECT id, name, server_id FROM channels;

# View direct messages
SELECT id, user_1_id, user_2_id FROM direct_messages;

# View group chats
SELECT id, name, owner_id FROM group_chats;

# Exit
\q
```

## Performance Monitoring

```bash
# Monitor CPU & Memory
docker stats

# View Docker logs
docker-compose logs -f postgres
docker-compose logs -f redis

# View backend logs
npm run dev
```

## Common Test Issues

**Q: "Cannot find module" error**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Q: Database connection refused**
```bash
# Solution: Start Docker services
docker-compose up -d

# Wait a few seconds and try again
```

**Q: Port 3000 already in use**
```bash
# Kill process using port
lsof -ti:3000 | xargs kill -9

# Or use different port
BACKEND_PORT=3001 npm run dev
```

**Q: WebSocket connection fails**
```bash
# Make sure backend is running
npm run dev

# Check your token is valid
# Check frontend URL in CORS config
```

---

## Test Checklist

- [ ] Backend starts without errors
- [ ] Health check returns 200
- [ ] User registration works
- [ ] User login works
- [ ] Server creation works
- [ ] Channel creation works
- [ ] Message sending works
- [ ] Message editing works
- [ ] Message deletion works
- [ ] Direct messages work
- [ ] Group chats work
- [ ] WebSocket connection works
- [ ] User presence updates
- [ ] Typing indicators work
- [ ] Room join/leave works

---

**Backend Status: Ready for Testing! 🎉**
