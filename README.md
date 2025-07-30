# Real-Time Event Engagement Platform

A full-stack React Native application with Node.js backend that allows users to browse events and join them with real-time updates.

## Features

- 🔐 JWT Authentication (Login/Register)
- 📱 React Native mobile app with Expo
- 🚀 GraphQL API with Apollo Server
- 🔄 Real-time updates with Socket.io
- 📊 PostgreSQL database with Prisma ORM
- 🎯 State management with Zustand
- 📡 Data fetching with TanStack Query
- 💾 Secure token storage with Expo SecureStore

## Tech Stack

### Backend
- Node.js + TypeScript
- GraphQL (Apollo Server)
- PostgreSQL + Prisma ORM
- Socket.io for real-time updates
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React Native + Expo
- TypeScript
- Apollo Client (GraphQL)
- TanStack Query
- Zustand (state management)
- React Navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or physical device)

### Backend Setup

1. **Clone and navigate to backend directory:**
   \`\`\`bash
   git clone <your-repo-url>
   cd event-platform/backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Update the `.env` file with your PostgreSQL connection string and JWT secret.

4. **Set up the database:**
   \`\`\`bash
   npm run db:push
   npm run db:generate
   \`\`\`

5. **Seed the database with sample data:**
   \`\`\`bash
   npm run db:seed
   \`\`\`

6. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

The GraphQL server will be running at `http://localhost:4000/graphql`

### Frontend Setup

1. **Navigate to frontend directory:**
   \`\`\`bash
   cd ../frontend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Update server URLs:**
   Update the server URLs in:
   - `src/lib/apollo.ts`
   - `src/lib/socket.ts`
   
   Replace `http://localhost:4000` with your actual server URL.

4. **Start the Expo development server:**
   \`\`\`bash
   npm start
   \`\`\`

5. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Sample Credentials

Use these credentials to test the application:

- **Email:** `john@example.com`
- **Password:** `password123`

Or:

- **Email:** `jane@example.com`
- **Password:** `password123`

You can also create a new account using the registration form.

## API Endpoints

### GraphQL Queries
- `events` - Get all events
- `event(id: ID!)` - Get specific event
- `me` - Get current user

### GraphQL Mutations
- `login(email: String!, password: String!)` - User login
- `register(name: String!, email: String!, password: String!)` - User registration
- `joinEvent(eventId: ID!)` - Join an event
- `leaveEvent(eventId: ID!)` - Leave an event

### Socket.io Events
- `join-event` - Join event room for real-time updates
- `leave-event` - Leave event room
- `event-updated` - Receive real-time event updates

## Project Structure

\`\`\`
event-platform/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── schema.ts         # GraphQL schema
│   │   ├── resolvers.ts      # GraphQL resolvers
│   │   ├── types.ts          # TypeScript types
│   │   └── seed.ts           # Database seeding
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── screens/          # React Native screens
│   │   ├── store/            # Zustand stores
│   │   ├── lib/              # Apollo & Socket.io setup
│   │   ├── graphql/          # GraphQL queries & mutations
│   │   └── types/            # TypeScript types
│   ├── App.tsx               # Main app component
│   └── package.json
└── README.md
\`\`\`

## Real-time Features

The application implements real-time updates using Socket.io:

1. **Event Joining:** When a user joins an event, all other users viewing the same event see the update instantly
2. **Live Attendee List:** The attendee list updates in real-time without requiring a page refresh
3. **Attendee Count:** The number of attendees updates live across all connected clients

## Development Notes

- The backend uses JWT tokens for authentication
- Passwords are hashed using bcryptjs
- The frontend stores JWT tokens securely using Expo SecureStore
- Real-time updates are handled through Socket.io rooms (one room per event)
- The app uses optimistic updates for better UX

## Troubleshooting

1. **Database connection issues:** Make sure PostgreSQL is running and the connection string in `.env` is correct
2. **Network errors in app:** Update the server URLs in Apollo and Socket.io configuration files
3. **Authentication issues:** Clear the app data/cache and try logging in again

## Future Enhancements

- Push notifications for event updates
- Event creation functionality
- User profiles and avatars
- Event categories and filtering
- Location-based event discovery
- Social features (comments, ratings)
