# Quick Start Guide - Impact Dashboard & Community Hub

## For End Users

### Accessing the Features

#### Impact Dashboard

**Path**: `http://localhost:3000/dashboard/impact` (requires individual user login)

**What You'll See**:

- Your lifetime environmental impact metrics
- CO₂ saved, waste diverted, pickups completed
- Cool equivalencies (how many trees you saved, plastic bottles, car km avoided)
- Visual charts showing your waste breakdown and monthly trends
- Share your impact on Facebook or Twitter

**How to Use**:

1. Log in as an individual user
2. Navigate to "Impact Dashboard" from the sidebar
3. View your statistics (updates automatically)
4. Click "Share Your Impact" buttons to post to social media
5. Copy the impact message to share with friends

---

#### Community Hub

**Path**: `http://localhost:3000/dashboard/communities` (requires individual user login)

**What You'll See**:

- If not in a community: Search and discover communities
- If in a community: Join multiple communities and participate in their hubs

### Finding Communities

1. Go to **Discover** tab
2. Search by:
   - Community name
   - City/Location
   - Postal code
3. Click **"Join Community"** on any card
4. Your request will be sent to community admin
5. Once approved, you'll see the **Hub** tab

### Community Hub Features

Once you're a member:

**Create a Post**:

1. Click **"New Post"** button
2. Choose post type (Giveaway 🎁, Announcement 📢, Discussion 💬, Request 🙏)
3. Add title and description
4. For giveaways: Specify item condition and category
5. Click **"Post"**

**Browse Posts**:

1. Use filter badges to view: All Posts, Giveaways, Announcements, Discussion
2. Posts are sorted with pinned posts at the top
3. Click on any post to expand and see details

**Interact with Posts**:

- **Like**: Click the heart icon to like/unlike
- **Comment**: Click comment icon to expand comments section and add your comment
- **Claim (Giveaway items)**: Click "Claim Item" button to claim an available giveaway
- **View Comments**: Click comment icon to see all comments and add your own

**Switch Communities**:

- Left sidebar shows all your communities
- Click any community to view its posts
- Selected community is highlighted in green

---

## For Developers

### Environment Setup

1. **Install Dependencies**:

```bash
cd client
npm install  # Installs all packages including recharts
cd ../server
npm install
```

2. **Environment Variables** (ensure these are set in backend):

```
MONGODB_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
```

3. **Start Services**:

```bash
# Terminal 1: Backend
cd server
npm start  # Runs on port 5000

# Terminal 2: Frontend
cd client
npm start  # Runs on port 3000
```

### API Endpoints Reference

#### Impact Endpoints

```
GET /api/impact/stats
Query: None
Headers: Authorization: Bearer <token>
Response: {
  lifetime_co2_saved: number,
  lifetime_waste_diverted: number,
  lifetime_pickups: number,
  waste_by_category: Array,
  monthly_trend: Array,
  equivalencies: { trees_planted, plastic_bottles_saved, car_km_avoided }
}

GET /api/impact/stats/monthly?year=2024&month=3
Query: year, month
Headers: Authorization: Bearer <token>
Response: Monthly impact stats with category breakdown
```

#### Community Endpoints

```
GET /api/communities/search?q=SearchTerm
POST /api/communities/:communityId/join
GET /api/communities/my-communities
GET /api/communities/:communityId/posts?type=giveaway&page=1
POST /api/communities/:communityId/posts
POST /api/communities/posts/:postId/claim
POST /api/communities/posts/:postId/comment {text: "comment text"}
POST /api/communities/posts/:postId/like
```

### Frontend Component Structure

```
/client/src/pages/Dashboard/
├── Impact.js (Wrapper)
├── Components/
│   └── Impact/
│       ├── Impact.js (Main component)
│       └── Impact.module.css
└── Communities.js (Wrapper pointing to Community Hub)
    └── Components/
        └── Community/
            ├── Community.js (Main component with Discovery & Hub)
            └── Community.module.css
```

### Key Component Props & State

#### Impact Component

- No required props
- Uses AuthContext for user data
- Fetches data via impactService

#### Community Component

- No required props
- Uses AuthContext for user data and user ID
- State includes:
  - `activeTab`: 'discover' | 'hub'
  - `searchQuery`: Current search term
  - `userCommunities`: Array of joined communities
  - `selectedCommunity`: Currently viewed community
  - `posts`: Array of posts in selected community
  - `postFilter`: Type filter for posts

### Customization Guide

#### Changing Chart Colors (Impact Dashboard)

Edit `/client/src/pages/Dashboard/components/Impact/Impact.js`:

```javascript
const COLORS = ["#51CF66", "#40C057", "#37B24D", "#2F9E44", "#2B8A3E"];
// Change hex values to your desired colors
```

#### Modifying CO₂ Calculation Formula

Edit `/server/controllers/impactController.js`:

```javascript
const CO2_SAVINGS_PER_KG = 2.5; // Change this value
```

#### Updating Post Types

Edit `/server/models/CommunityPost.js`:

```javascript
type: { type: String, enum: ['giveaway', 'request', 'announcement', 'discussion'], required: true }
// Add new types to enum array
```

#### Changing Number of Monthly Trend Months

Edit `/server/controllers/impactController.js`:

```javascript
const MONTHS = 12; // Change this value for more/fewer months
```

---

## Troubleshooting

### Common Issues

**"Missing Recharts"**

```
npm install recharts
```

**"Community not found"**

- Verify community ID is correct
- Ensure community exists in database
- Check user is authenticated

**"Posts not loading"**

- Verify user is member of community
- Check browser console for API errors
- Ensure backend is running on port 5000

**"Chart not rendering"**

- Verify data is being returned from backend
- Check Recharts is installed
- Look for browser console errors

**"Can't join community"**

- Verify user is authenticated
- Check if request already pending
- Ensure user isn't already a member

### Debug Mode

Enable detailed logging:

```javascript
// In frontend components
console.log("Current data:", data);

// In backend controllers
console.log("Impact Stats:", stats);
```

---

## Performance Optimization

### Caching Recommendations

1. Cache impact stats for 1 hour (user impact doesn't change frequently)
2. Cache community search results for 5 minutes
3. Use pagination for large post lists (already implemented)

### Database Indexes (Recommended)

```javascript
// In your database setup:
db.communities.createIndex({ name: 1, "address.city": 1 });
db.communityposts.createIndex({ community: 1, createdAt: -1 });
db.pickups.createIndex({ user: 1, status: 1 });
```

---

## Security Checklist

✅ All endpoints protected with authMiddleware
✅ User membership validation for post creation
✅ Claim prevention for already-claimed items
✅ Comment author tracking
✅ Rate limiting recommended for search endpoint
✅ Input validation on all text fields
✅ XSS prevention through React escaping

### Recommended Security Enhancements

1. Add rate limiting to search endpoint
2. Implement email verification for join requests
3. Add admin moderation for reported posts
4. Implement soft delete for community posts
5. Add audit logging for sensitive operations

---

## Database Schema Requirements

### Collections Needed

```
- users (existing)
- pickups (existing)
- communities (existing - updated)
- communityPosts (NEW - created)
- recyclerprofiles (existing)
```

### Field Validations

- Community search requires at least 2 characters
- Post titles limited to 255 characters
- Post descriptions limited to 5000 characters
- Maximum 50 comments per post
- Maximum 1000 likes per post

---

## Next Steps

### For Deployment

1. Run `npm run build` in client folder
2. Ensure all env variables are set in production
3. Test all endpoints with actual data
4. Set up database indexes for performance
5. Configure CDN for static assets

### For Feature Expansion

1. Add image upload for community posts
2. Implement community moderation dashboard
3. Add user reputation system
4. Create impact comparison features
5. Build mobile app using React Native

---

## Support & Documentation

For issues or questions:

1. Check error messages in browser console
2. Review backend logs
3. Verify all data types match schema
4. Test endpoints with Postman
5. Check network tab in browser dev tools

---

**Happy recycling! 🌱♻️**
