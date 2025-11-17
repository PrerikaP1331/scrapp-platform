# API Documentation - Impact Dashboard & Community Hub

## Base URL

```
Production: https://api.scrapp.com
Development: http://localhost:5000
```

## Authentication

All protected endpoints require:

```
Headers: {
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

---

## Impact Endpoints

### 1. Get User Impact Statistics

**Endpoint**: `GET /api/impact/stats`

**Authentication**: Required (Bearer Token)

**Query Parameters**: None

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/impact/stats \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "_id": "user_id",
    "lifetime_co2_saved": 45.5,
    "lifetime_waste_diverted": 18.2,
    "lifetime_pickups": 12,
    "waste_by_category": [
      {
        "category": "Electronics",
        "total_weight": 5.5,
        "_id": "..."
      },
      {
        "category": "Plastic",
        "total_weight": 8.3,
        "_id": "..."
      }
    ],
    "monthly_trend": [
      {
        "month": "2024-01-01T00:00:00.000Z",
        "co2_saved": 3.5,
        "waste_recycled": 1.4,
        "_id": "..."
      },
      {
        "month": "2024-02-01T00:00:00.000Z",
        "co2_saved": 4.2,
        "waste_recycled": 1.7,
        "_id": "..."
      }
    ],
    "equivalencies": {
      "trees_planted": 8,
      "plastic_bottles_saved": 127,
      "car_km_avoided": 182
    }
  },
  "msg": "Impact stats retrieved successfully"
}
```

**Error Response (401)**:

```json
{
  "msg": "No token provided"
}
```

**Error Response (400)**:

```json
{
  "msg": "No completed pickups found"
}
```

---

### 2. Get Monthly Impact Statistics

**Endpoint**: `GET /api/impact/stats/monthly`

**Authentication**: Required (Bearer Token)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | Yes | Year (e.g., 2024) |
| month | integer | Yes | Month 1-12 |

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/impact/stats/monthly?year=2024&month=3" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "month": "March 2024",
    "co2_saved": 12.5,
    "waste_diverted": 5.0,
    "pickups": 4,
    "waste_by_category": [
      {
        "category": "Electronics",
        "weight": 2.5,
        "percentage": 50
      },
      {
        "category": "Plastic",
        "weight": 2.5,
        "percentage": 50
      }
    ]
  },
  "msg": "Monthly stats retrieved successfully"
}
```

**Error Response (400)**:

```json
{
  "msg": "Invalid year or month"
}
```

---

## Community Endpoints

### 1. Search Communities

**Endpoint**: `GET /api/communities/search`

**Authentication**: Required (Bearer Token)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (name, city, postal code) |

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/communities/search?q=green%20society" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": [
    {
      "_id": "comm_123",
      "name": "Green Society",
      "type": "housing",
      "description": "Environmental community in downtown",
      "address": {
        "city": "San Francisco",
        "postalCode": "94102",
        "coordinates": { "lat": 37.7749, "lng": -122.4194 }
      },
      "memberCount": 145,
      "isMember": false,
      "hasPendingRequest": false,
      "image": "https://..."
    }
  ],
  "msg": "Communities found"
}
```

**Error Response (400)**:

```json
{
  "msg": "Search query must be at least 2 characters"
}
```

---

### 2. Get User's Communities

**Endpoint**: `GET /api/communities/my-communities`

**Authentication**: Required (Bearer Token)

**Query Parameters**: None

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/communities/my-communities \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": [
    {
      "_id": "comm_123",
      "name": "Green Society",
      "description": "Environmental community",
      "memberCount": 145,
      "members": [{ "_id": "user_1", "name": "John" }, ...],
      "admin": { "_id": "admin_1", "name": "Jane" },
      "address": {
        "city": "San Francisco"
      }
    }
  ],
  "msg": "Communities retrieved successfully"
}
```

---

### 3. Request to Join Community

**Endpoint**: `POST /api/communities/:communityId/join`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| communityId | string | MongoDB ObjectId |

**Request Body**: None

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/communities/comm_123/join \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "communityId": "comm_123",
    "userId": "user_456",
    "message": "Join request submitted"
  },
  "msg": "Request to join community submitted"
}
```

**Error Response (409)**:

```json
{
  "msg": "Already a member or pending request exists"
}
```

---

### 4. Get Community Posts

**Endpoint**: `GET /api/communities/:communityId/posts`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| communityId | string | MongoDB ObjectId |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Filter: 'giveaway', 'announcement', 'discussion', 'request' |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Posts per page (default: 10) |

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/communities/comm_123/posts?type=giveaway&page=1" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "posts": [
      {
        "_id": "post_789",
        "type": "giveaway",
        "title": "Free Coffee Machine",
        "description": "Barely used, working condition",
        "author": {
          "_id": "user_123",
          "name": "Alice",
          "avatar": "https://..."
        },
        "itemDetails": {
          "condition": "like-new",
          "category": "Electronics",
          "images": []
        },
        "status": "active",
        "likes": ["user_1", "user_2"],
        "comments": [
          {
            "author": { "_id": "user_5", "name": "Bob" },
            "text": "Still available?"
          }
        ],
        "isPinned": true,
        "createdAt": "2024-03-15T10:30:00.000Z"
      }
    ],
    "page": 1,
    "pages": 3,
    "total": 25
  },
  "msg": "Posts retrieved successfully"
}
```

---

### 5. Create Community Post

**Endpoint**: `POST /api/communities/:communityId/posts`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| communityId | string | MongoDB ObjectId |

**Request Body**:

```json
{
  "type": "giveaway",
  "title": "Free Bicycle",
  "description": "Mountain bike, 21 gears, great condition",
  "itemDetails": {
    "condition": "good",
    "category": "Sports Equipment",
    "images": []
  }
}
```

**Validation**:

- type: Required, enum ['giveaway', 'announcement', 'discussion', 'request']
- title: Required, max 255 characters
- description: Required, max 5000 characters
- itemDetails: Required for giveaway type

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/communities/comm_123/posts \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "giveaway",
    "title": "Free Bicycle",
    "description": "Mountain bike, 21 gears",
    "itemDetails": { "condition": "good", "category": "Sports" }
  }'
```

**Response (201 Created)**:

```json
{
  "data": {
    "_id": "post_789",
    "community": "comm_123",
    "author": "user_123",
    "type": "giveaway",
    "title": "Free Bicycle",
    "status": "active",
    "createdAt": "2024-03-15T10:30:00.000Z"
  },
  "msg": "Post created successfully"
}
```

**Error Response (403)**:

```json
{
  "msg": "You are not a member of this community"
}
```

---

### 6. Claim Item (Giveaway)

**Endpoint**: `POST /api/communities/posts/:postId/claim`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| postId | string | MongoDB ObjectId |

**Request Body**: None

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/communities/posts/post_789/claim \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "_id": "post_789",
    "status": "claimed",
    "claimedBy": "user_456",
    "claimedAt": "2024-03-15T10:35:00.000Z"
  },
  "msg": "Item claimed successfully"
}
```

**Error Response (409)**:

```json
{
  "msg": "Item already claimed"
}
```

---

### 7. Add Comment to Post

**Endpoint**: `POST /api/communities/posts/:postId/comment`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| postId | string | MongoDB ObjectId |

**Request Body**:

```json
{
  "text": "I'm interested in this item!"
}
```

**Validation**:

- text: Required, min 1 character, max 1000 characters

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/communities/posts/post_789/comment \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{ "text": "Is this still available?" }'
```

**Response (201 Created)**:

```json
{
  "data": {
    "_id": "comment_123",
    "author": {
      "_id": "user_456",
      "name": "Bob"
    },
    "text": "Is this still available?",
    "createdAt": "2024-03-15T10:36:00.000Z"
  },
  "msg": "Comment added successfully"
}
```

---

### 8. Like/Unlike Post

**Endpoint**: `POST /api/communities/posts/:postId/like`

**Authentication**: Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| postId | string | MongoDB ObjectId |

**Request Body**: None (Toggle - if user already liked, it will unlike)

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/communities/posts/post_789/like \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK)**:

```json
{
  "data": {
    "_id": "post_789",
    "likes": ["user_1", "user_2", "user_456"],
    "likeCount": 3,
    "action": "liked"
  },
  "msg": "Post liked successfully"
}
```

**Response (200 OK - Unlike)**:

```json
{
  "data": {
    "_id": "post_789",
    "likes": ["user_1", "user_2"],
    "likeCount": 2,
    "action": "unliked"
  },
  "msg": "Post unliked successfully"
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning      | Example                           |
| ---- | ------------ | --------------------------------- |
| 200  | Success      | Request completed successfully    |
| 201  | Created      | New resource created (POST)       |
| 400  | Bad Request  | Missing/invalid parameters        |
| 401  | Unauthorized | Missing/invalid token             |
| 403  | Forbidden    | User lacks permission             |
| 404  | Not Found    | Resource doesn't exist            |
| 409  | Conflict     | Resource already exists/duplicate |
| 500  | Server Error | Internal server error             |

### Error Response Format

```json
{
  "msg": "Error description",
  "error": "Additional error details (optional)"
}
```

---

## Rate Limiting

Recommended rate limits:

- Search endpoint: 30 requests per minute per user
- Post creation: 10 requests per hour per user
- Comment creation: 60 requests per hour per user
- Impact stats: 10 requests per hour per user

---

## Data Types & Formats

### Date Format

ISO 8601: `2024-03-15T10:30:00.000Z`

### Community Types

- `housing` - Housing society/apartment complex
- `office` - Corporate office
- `ngo` - Non-profit organization
- `municipality` - Local government area
- `other` - Other community type

### Post Types

- `giveaway` - Offer items for free
- `announcement` - Important information
- `discussion` - Community discussion topic
- `request` - Request for items/help

### Post Status

- `active` - Post is active
- `claimed` - Item claimed (giveaway only)
- `completed` - Post completed
- `archived` - Post archived

### Item Condition (for Giveaways)

- `like-new` - Barely used, like new
- `good` - Good working condition
- `fair` - Fair condition, some wear
- `needs-repair` - Needs repair

---

## Pagination

Posts endpoint supports pagination:

- **Default page size**: 10
- **Max page size**: 50
- **Response includes**: `page`, `pages`, `total`

Example:

```json
{
  "data": { "posts": [...] },
  "page": 1,
  "pages": 5,
  "total": 45
}
```

---

## Code Examples

### JavaScript/Fetch

```javascript
// Get impact stats
const response = await fetch("http://localhost:5000/api/impact/stats", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await response.json();

// Search communities
const searchResponse = await fetch(
  "http://localhost:5000/api/communities/search?q=green",
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Python/Requests

```python
import requests

headers = {'Authorization': f'Bearer {token}'}

# Get impact stats
response = requests.get(
    'http://localhost:5000/api/impact/stats',
    headers=headers
)
data = response.json()

# Search communities
search_response = requests.get(
    'http://localhost:5000/api/communities/search',
    params={'q': 'green'},
    headers=headers
)
```

### cURL

```bash
# Get impact stats
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/api/impact/stats

# Search communities
curl -H "Authorization: Bearer TOKEN" \
     "http://localhost:5000/api/communities/search?q=green"
```

---

## Webhook Events (Future)

Planned webhook events:

- `post.created` - New post created
- `item.claimed` - Giveaway item claimed
- `comment.added` - Comment added to post
- `user.joined_community` - User joined community
- `pickup.completed` - Pickup completed

---

## Support

For API issues:

1. Check status at `GET /api/health`
2. Review error message carefully
3. Verify request format and parameters
4. Check authentication token validity
5. Contact support@scrapp.com

---

**Last Updated**: March 2024
**API Version**: 1.0
**Documentation Version**: 1.0
