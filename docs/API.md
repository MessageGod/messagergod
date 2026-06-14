# MessageGod API Reference

## Authentication Endpoints

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "displayName": "John Doe"
}

Response: 201
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe"
}
```

### Logout
```
POST /api/auth/logout

Response: 200
```

### Get Current User
```
GET /api/auth/me

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "status": "online"
}
```

---

## Users Endpoints

### Get User Profile
```
GET /api/users/:userId

Response: 200
{
  "id": "uuid",
  "username": "johndoe",
  "displayName": "John Doe",
  "avatarUrl": "https://...",
  "bio": "Hello!",
  "status": "online",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile
```
PUT /api/users/:userId
Content-Type: application/json

{
  "displayName": "New Name",
  "bio": "New bio",
  "avatarUrl": "https://..."
}

Response: 200
```

### Search Users
```
GET /api/users/search?q=john&limit=10

Response: 200
[
  {
    "id": "uuid",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatarUrl": "https://..."
  }
]
```

---

## Direct Messages Endpoints

### List DMs
```
GET /api/dms

Response: 200
[
  {
    "id": "uuid",
    "otherUser": { "id": "uuid", "username": "jane", "displayName": "Jane Doe" },
    "lastMessage": "Hello!",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Create/Open DM
```
POST /api/dms
Content-Type: application/json

{
  "userId": "other-user-uuid"
}

Response: 201
{
  "id": "uuid",
  "user1Id": "uuid",
  "user2Id": "uuid"
}
```

### Get DM Messages
```
GET /api/dms/:dmId/messages?limit=50&offset=0

Response: 200
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "senderUsername": "jane",
    "content": "Hello!",
    "createdAt": "2024-01-01T00:00:00Z",
    "editedAt": null,
    "deletedAt": null
  }
]
```

---

## Group Chats Endpoints

### List Group Chats
```
GET /api/group-chats

Response: 200
[
  {
    "id": "uuid",
    "name": "Project Team",
    "iconUrl": "https://...",
    "ownerId": "uuid",
    "memberCount": 5,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Create Group Chat
```
POST /api/group-chats
Content-Type: application/json

{
  "name": "Project Team",
  "memberIds": ["uuid1", "uuid2", "uuid3"]
}

Response: 201
{
  "id": "uuid",
  "name": "Project Team",
  "ownerId": "uuid"
}
```

### Get Group Chat Messages
```
GET /api/group-chats/:groupChatId/messages?limit=50&offset=0

Response: 200
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "senderUsername": "john",
    "content": "Hello team!",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Add Member to Group Chat
```
POST /api/group-chats/:groupChatId/members
Content-Type: application/json

{
  "userId": "uuid"
}

Response: 201
```

### Remove Member from Group Chat
```
DELETE /api/group-chats/:groupChatId/members/:userId

Response: 204
```

---

## Servers Endpoints

### List User's Servers
```
GET /api/servers

Response: 200
[
  {
    "id": "uuid",
    "name": "My Community",
    "description": "A cool community",
    "iconUrl": "https://...",
    "ownerId": "uuid",
    "memberCount": 100,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Create Server
```
POST /api/servers
Content-Type: application/json

{
  "name": "My Community",
  "description": "A cool community"
}

Response: 201
{
  "id": "uuid",
  "name": "My Community",
  "ownerId": "uuid"
}
```

### Get Server Details
```
GET /api/servers/:serverId

Response: 200
{
  "id": "uuid",
  "name": "My Community",
  "description": "A cool community",
  "iconUrl": "https://...",
  "ownerId": "uuid",
  "channels": [
    {
      "id": "uuid",
      "name": "general",
      "type": "text",
      "position": 0
    }
  ],
  "members": [
    {
      "id": "uuid",
      "username": "john",
      "roles": ["admin"]
    }
  ]
}
```

### Update Server
```
PUT /api/servers/:serverId
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: 200
```

### Delete Server
```
DELETE /api/servers/:serverId

Response: 204
```

---

## Channels Endpoints

### List Server's Channels
```
GET /api/servers/:serverId/channels

Response: 200
[
  {
    "id": "uuid",
    "name": "general",
    "description": "General discussion",
    "type": "text",
    "position": 0
  }
]
```

### Create Channel
```
POST /api/servers/:serverId/channels
Content-Type: application/json

{
  "name": "announcements",
  "description": "Important announcements",
  "type": "text"
}

Response: 201
{
  "id": "uuid",
  "serverId": "uuid",
  "name": "announcements",
  "type": "text"
}
```

### Get Channel Messages
```
GET /api/channels/:channelId/messages?limit=50&offset=0

Response: 200
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "senderUsername": "john",
    "senderAvatar": "https://...",
    "content": "Hello everyone!",
    "createdAt": "2024-01-01T00:00:00Z",
    "editedAt": null,
    "deletedAt": null
  }
]
```

### Update Channel
```
PUT /api/channels/:channelId
Content-Type: application/json

{
  "name": "new-name",
  "description": "new description"
}

Response: 200
```

### Delete Channel
```
DELETE /api/channels/:channelId

Response: 204
```

---

## Messages Endpoints

### Send Message
```
POST /api/messages
Content-Type: application/json

{
  "channelId": "uuid" (optional),
  "directMessageId": "uuid" (optional),
  "groupChatId": "uuid" (optional),
  "content": "Hello!"
}

Response: 201
{
  "id": "uuid",
  "senderId": "uuid",
  "content": "Hello!",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Edit Message
```
PUT /api/messages/:messageId
Content-Type: application/json

{
  "content": "Updated message"
}

Response: 200
```

### Delete Message
```
DELETE /api/messages/:messageId

Response: 204
```

---

## Error Responses

All errors follow this format:

```
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Errors
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
