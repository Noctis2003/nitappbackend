# NIT App Backend

A comprehensive backend API for a college community platform built with NestJS, designed specifically for National Institute of Technology (NIT) students and faculty.

## 🚀 Features

### Core Modules

- **Authentication & Authorization**
  - Google OAuth 2.0 integration
  - JWT-based authentication with refresh tokens
  - Secure cookie-based session management
  - Domain-based user segregation (by email domain)

- **Forum System**
  - Create, read, update, delete posts
  - Comment on posts
  - Like/unlike functionality
  - User-specific content management

- **Marketplace (Shop)**
  - Buy/sell products within the college community
  - Image upload support with public ID tracking
  - Phone number contact information
  - Domain-filtered product listings

- **Collaboration Platform**
  - Create collaboration gigs with multiple roles
  - Apply for specific roles in projects
  - Local (same institution) vs Global collaboration scope
  - Role-based application management

- **Gossip/Confessions**
  - Anonymous content sharing
  - Domain-filtered gossip feed
  - Real-time content discovery

- **User Management**
  - Profile management
  - Activity tracking
  - Comprehensive user data aggregation

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js (Google OAuth2, JWT)
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📦 Dependencies

### Core Dependencies
- `@nestjs/core`, `@nestjs/common` - NestJS framework
- `@prisma/client`, `prisma` - Database ORM
- `@nestjs/passport`, `passport` - Authentication
- `@nestjs/jwt`, `jsonwebtoken` - JWT handling
- `passport-google-oauth20` - Google OAuth integration
- `bcrypt`, `bcryptjs` - Password hashing
- `class-validator`, `class-transformer` - Request validation

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Google OAuth credentials

### Environment Variables
Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
FRONTEND_URL="your_frontend_url"
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nitappbackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Development**
   ```bash
   npm run start:dev
   ```

5. **Production build**
   ```bash
   npm run build
   npm run start:prod
   ```

## 📡 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/refresh` - Refresh JWT token
- `GET /auth/profile` - Get user profile
- `GET /auth/email` - Get user email domain

### Forum
- `POST /forum/create` - Create new post
- `GET /forum/get` - Get all posts
- `GET /forum/getsingle?id={id}` - Get single post
- `POST /forum/comment` - Add comment to post
- `GET /forum/comments?postId={id}` - Get comments for post
- `POST /forum/like` - Like/unlike post
- `POST /forum/liked` - Check if post is liked
- `DELETE /forum/delete?id={id}` - Delete post

### Shop/Marketplace
- `POST /shop/create` - Create product listing
- `GET /shop/all` - Get all products (domain-filtered)
- `DELETE /shop/delete?id={id}` - Delete product

### Collaboration
- `POST /collab/create` - Create collaboration gig
- `GET /collab/get?scope={local|global}` - Get collaborations
- `GET /collab/collabs?id={id}` - Get specific collaboration
- `POST /collab/apply` - Apply for collaboration role
- `DELETE /collab/collab?id={id}` - Delete collaboration
- `DELETE /collab/delete?id={id}` - Delete application

### Gossip
- `POST /gossip/create` - Create gossip post
- `GET /gossip/get` - Get gossip feed (domain-filtered)

### User
- `POST /user` - Create user
- `GET /user/all` - Get user profile with relations
- `PATCH /user/{id}` - Update user
- `DELETE /user/{id}` - Delete user

## 🗄 Database Schema

The application uses the following main entities:

- **User** - Core user information and relationships
- **ForumPost, ForumComment, ForumLike** - Forum system
- **MarketplaceProduct** - Product listings
- **CollabGig, CollabRole, CollabApplication** - Collaboration system
- **Gossip** - Anonymous content sharing

## 🔐 Security Features

- JWT-based authentication with access and refresh tokens
- HTTP-only secure cookies
- CORS configuration for production frontend
- Input validation and sanitization
- Domain-based content filtering
- Protected routes with JWT guards

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📝 Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🌐 Deployment

The application is configured for deployment with:
- CORS enabled for production frontend
- Environment-based configuration
- Production-ready cookie settings
- Secure authentication flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under UNLICENSED - see the package.json file for details.

## 🔗 Related

- Frontend: [NIT App Frontend](https://nitapp.vercel.app)
- Database: PostgreSQL with Prisma ORM
- Deployment: Render (Backend), Vercel (Frontend)