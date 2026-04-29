# Connect-Me 🚀

A modern social media platform built with cutting-edge web technologies, featuring real-time interactions, user authentication, and a beautiful dark-themed UI.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Implemented Features](#-implemented-features)
  - [Planned Features](#-planned-features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Scalability](#scalability)
- [Performance Considerations](#performance-considerations)
- [Future Roadmap](#future-roadmap)

---

## Overview

Connect-Me is a next-generation social networking platform that enables users to:
- Share thoughts through posts
- Discover and follow other users
- Engage with content through likes and comments
- Build meaningful connections in a community-driven environment

Built with **Next.js 16**, **React 19**, **Prisma ORM**, and **PostgreSQL**, with modern authentication via **NextAuth.js**.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js 4.24.14

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (RESTful)
- **ORM**: Prisma 7.7.0
- **Database**: PostgreSQL

### Development
- **Language**: TypeScript
- **Linter**: ESLint 9
- **Package Manager**: npm

---

## ✨ Features

### ✅ Implemented Features

#### 1. **User Authentication**
- User registration with username, password, and full name
- Secure login/logout functionality
- Session management via NextAuth.js
- Password-based authentication
- Token-based session storage

#### 2. **Post Management**
- Create new posts (up to 280 characters)
- View chronologically sorted posts
- Delete own posts
- Real-time character counter
- Post metadata (author, timestamp)

#### 3. **Engagement & Interactions**
- Like/unlike posts with like counter
- Comment on posts with real-time comment display
- View comment history
- Interactive emoji reactions
- Post interaction analytics (likes, comments count)

#### 4. **User Discovery & Connection**
- Search for users by username
- Follow/unfollow functionality
- User profile page with follower/following stats
- Followers and followings tracking
- Follower statistics

#### 5. **User Profiles**
- Personal profile with user statistics
- Display posts count, followers, and following
- View own posts with delete option
- User information display (username, full name)
- Profile customization ready

#### 6. **User Interface**
- Dark theme with gradient backgrounds
- Responsive design (mobile-first)
- Smooth animations and transitions
- Consistent button styling
- Professional color scheme (Indigo, Emerald, Cyan accents)
- Fixed bottom navigation bar
- Real-time loading states

---

### 🚧 Planned Features

#### Phase 2: Advanced Features
- [ ] **Direct Messaging**
  - Private one-to-one messaging
  - Message history
  - Online status indicators

- [ ] **Notifications System**
  - Like notifications
  - Comment notifications
  - Follow notifications
  - Real-time notification bell

- [ ] **Media Support**
  - Image uploads to posts
  - Avatar customization
  - Image galleries in profiles

- [ ] **Advanced Search**
  - Full-text search on posts
  - Hashtag support
  - Search filters
  - Trending topics

#### Phase 3: Social Features
- [ ] **Trends & Recommendations**
  - Trending posts feed
  - User recommendations
  - Algorithmic post feed
  - Related content suggestions

- [ ] **User Profiles Enhancement**
  - Bio/description
  - Profile cover image
  - Verified badges
  - Profile privacy settings

- [ ] **Content Moderation**
  - Report inappropriate content
  - Block users
  - Content filtering
  - User reputation system

#### Phase 4: Performance & Scale
- [ ] **Caching Layer**
  - Redis caching
  - Query result caching
  - Feed caching

- [ ] **Search Optimization**
  - Elasticsearch integration
  - Full-text search indexing

- [ ] **Analytics Dashboard**
  - User engagement metrics
  - Post performance stats
  - User activity tracking

---

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/connect-me.git
cd connect-me
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/connect_me"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. **Setup database**
```bash
# Create migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Usage

### User Registration & Login
1. Visit the Sign Up page (`/signup`)
2. Enter username, password, and full name
3. Submit to create account
4. Login with credentials on Sign In page (`/signin`)

### Creating Posts
1. Navigate to "Create Post" in bottom navigation
2. Write your content (max 280 characters)
3. Click "Post" to publish
4. Post appears in feed immediately

### Engaging with Content
1. **Like**: Click the ❤️ heart icon on any post
2. **Comment**: Click the 💬 comment icon to view/add comments
3. **Delete** (own posts only): Click Delete button below your post

### Finding Users
1. Go to "Search" page
2. Enter username to search
3. Click "Follow" button to follow a user
4. View followers/following on your profile

### Viewing Your Profile
1. Click "My Collection" in bottom navigation
2. View your posts, follower/following counts
3. Manage your posts (delete option available)

---

## Project Structure

```
connect-me/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── (display)/           # Main app pages
│   │   ├── CreatePostPage/
│   │   ├── MyInfoPage/
│   │   ├── PostsPage/
│   │   ├── SearchingPage/
│   │   └── layout.tsx       # Bottom navigation
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── post/
│   │   ├── user/
│   │   └── story/
│   ├── generated/           # Prisma client
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   ├── page.tsx
│   └── provider.tsx
├── components/              # Reusable components
│   ├── navbar.tsx
│   ├── lowerBar.tsx
│   ├── post.tsx
│   ├── logoutButton.tsx
├── lib/                     # Utilities
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts
│   └── migrations/
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Database Schema

### User Model
```typescript
model User {
  userId      String        @id @default(cuid())
  userName    String        @unique
  password    String
  name        String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  posts       Post[]
  followers   Connection[]  @relation("followers")
  followings  Connection[]  @relation("followings")
}
```

### Post Model
```typescript
model Post {
  id        String    @id @default(cuid())
  content   String?
  postedAt  DateTime  @default(now())
  authorId  String
  author    User      @relation(fields: [authorId], references: [userId])
  likes     Like[]
  comments  Comment[]
}
```

### Like Model
```typescript
model Like {
  id     String    @id @default(cuid())
  atTime DateTime  @default(now())
  atId   String
  at     Post      @relation(fields: [atId], references: [id])
}
```

### Comment Model
```typescript
model Comment {
  id          String    @id @default(cuid())
  writtenData String
  atTime      DateTime  @default(now())
  atId        String
  at          Post      @relation(fields: [atId], references: [id])
}
```

### Connection Model (Follow Relationship)
```typescript
model Connection {
  connectionId String    @id @default(cuid())
  toId         String
  byId         String
  to           User      @relation("followers", fields: [toId], references: [userId])
  by           User      @relation("followings", fields: [byId], references: [userId])
  atTime       DateTime  @default(now())
  @@unique([toId, byId])
}
```

---

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/user/createUser` - Register new user
- `POST /api/user/updatePassword` - Change password

### Posts
- `POST /api/post/createPost` - Create new post
- `DELETE /api/post/deletePost` - Delete post
- `GET /api/post/sortedPostList` - Get feed posts (sorted)
- `PUT /api/post/likeOnPost` - Like a post
- `POST /api/post/commentOnPost` - Comment on post
- `GET /api/post/getComments` - Get post comments

### Users
- `GET /api/user/aboutMe` - Get current user info
- `GET /api/user/getUserWithUserId` - Get user by ID
- `GET /api/user/filterOtherUser` - Search users
- `PUT /api/user/followUser` - Follow a user
- `PUT /api/user/updateMe` - Update profile

### Stories (Ready for implementation)
- `POST /api/story/addStory` - Add story
- `GET /api/story/viewStory` - View stories

---

## Scalability

### Current Architecture
The application is built with **scalability in mind** and follows modern best practices:

#### 1. **Database Level**
- **PostgreSQL** with Prisma ORM provides:
  - ACID compliance for data integrity
  - Support for complex queries with relationships
  - Connection pooling for multiple concurrent requests
  - Indexing capabilities for fast queries

#### 2. **API Design**
- **RESTful API structure** allows easy horizontal scaling
- **Stateless API routes** enable load balancing
- **Efficient query patterns** minimize N+1 problems

#### 3. **Frontend Architecture**
- **Server-side rendering (SSR)** improves performance
- **Client-side state management** reduces server load
- **Code splitting** via Next.js automatic chunking

### Scalability Recommendations

#### Short-term (0-10,000 users)
✅ Current architecture sufficient
- Single PostgreSQL instance
- Single Next.js server
- Basic CDN for static assets

#### Medium-term (10,000-100,000 users)
Recommended improvements:
```
├── Load Balancing
│   ├── Multiple Next.js instances behind load balancer
│   └── Sticky sessions for API consistency
├── Database Optimization
│   ├── Read replicas for query scaling
│   ├── Connection pooling (PgBouncer)
│   └── Strategic indexing on search queries
├── Caching Layer
│   ├── Redis for session management
│   ├── Query result caching
│   └── Feed caching
└── CDN Integration
    ├── Image delivery via CDN
    └── Static asset distribution
```

#### Large-scale (100,000+ users)
Enterprise-level considerations:
```
├── Microservices Architecture
│   ├── Posts service
│   ├── Users service
│   ├── Notifications service
│   └── Search service (Elasticsearch)
├── Database Sharding
│   ├── Horizontal partitioning by userId
│   ├── Separate databases for different regions
│   └── Master-slave replication
├── Message Queue
│   ├── RabbitMQ/Kafka for async operations
│   ├── Email notifications
│   └── Analytics pipeline
├── Search Engine
│   ├── Elasticsearch for full-text search
│   ├── Distributed indexing
│   └── Real-time search suggestions
└── Real-time Features
    ├── WebSocket server (Socket.io)
    ├── Real-time notifications
    └── Live feed updates
```


---

## Performance Considerations

### Implemented Optimizations ✅
1. **Efficient Database Queries**
   - Prisma prevents N+1 queries
   - Strategic relationship loading
   
2. **Frontend Optimization**
   - Image lazy loading ready
   - Component code splitting
   - Tailwind CSS purging

3. **Authentication**
   - JWT-based sessions
   - Secure password hashing

### Recommended Optimizations 📋
1. **Query Optimization**
   ```sql
   -- Add indexes on frequently searched columns
   CREATE INDEX idx_username ON User(userName);
   CREATE INDEX idx_author_id ON Post(authorId);
   CREATE INDEX idx_posted_at ON Post(postedAt DESC);
   ```

2. **Database Connection**
   ```env
   # Use connection pooling
   DATABASE_URL="postgresql://...?max_pool_size=20"
   ```

3. **Caching Strategy**
   ```typescript
   // Implement Redis for:
   - User session cache
   - Feed pagination cache
   - Search result caching
   ```

---

## Future Roadmap

- [ ] Direct messaging system
- [ ] Image upload support
- [ ] Notification system
- [ ] Advanced search with hashtags
- [ ] Trending topics feed
- [ ] Analytics dashboard

---

**Made using Next.js, React, and Tailwind CSS**

Last Updated: April 29, 2026
