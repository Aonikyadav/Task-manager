# Smart Task Flow

A modern, full-stack task management application built with React, TypeScript, Express, and MongoDB. Features a beautiful Kanban board interface with drag-and-drop functionality, real-time task management, and secure JWT-based authentication.

## ✨ Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 📌 **Task Management** - Organize tasks by status (Todo, In Progress, Completed) and priority (High, Medium, Low)
- 🔐 **Secure Authentication** - JWT-based authentication with protected routes
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Kanban Board** - Drag-and-drop task organization
- 🔍 **Filtering & Sorting** - Filter by status/priority and sort by various fields
- 📊 **Statistics Dashboard** - View task statistics at a glance
- 🌓 **Dark Mode** - Built-in theme switching
- ⚡ **Fast Performance** - Optimized with React Query and efficient state management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Routing
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📂 Project Structure

```
smart-task-flow/
├── backend/                 # Express backend
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   ├── .env.example        # Environment variables template
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── contexts/           # React contexts (Auth, Theme)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   └── main.tsx            # Entry point
├── public/                  # Static assets
├── .env.example            # Frontend environment template
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json
└── README.md               # This file
```

## ✅ Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB instance)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-task-flow
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Backend Environment Variables

Create `backend/.env` file:

```env
MONGODB_URI=your-mongodb-connection-string
PORT=5002
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_NAME=Admin User
CLEAR_DB=false
```

**Important:** 
- Replace `MONGODB_URI` with your MongoDB connection string
- Use a strong, random `JWT_SECRET` in production
- The admin credentials are optional but recommended

#### Frontend Environment Variables (Optional)

Create `.env` file in the root directory:

```env
VITE_API_BASE=http://localhost:5002
```

If not set, the app defaults to `http://localhost:5002`.

### 4. Start the Development Servers

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5002`

#### Start Frontend Server

In a new terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe" // optional
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Tasks (Requires Authentication)

All task endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "priority": "high" | "medium" | "low",
    "status": "todo" | "in-progress" | "completed",
    "dueDate": "2024-12-31T23:59:59.000Z" // optional
  }
  ```
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Health Check

- `GET /health` - Check API server status

## 🧪 Testing

Run frontend tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🏗️ Building for Production

### Build Frontend

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Build Backend

The backend doesn't require a build step. Ensure you have:
- Set proper environment variables
- Configured MongoDB connection
- Set a strong JWT_SECRET

## 🚀 Deployment

### Quick Deploy (Vercel - Recommended)

**Backend:**
```bash
cd backend
vercel
```

**Frontend:**
```bash
vercel
```

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions.

### Other Platforms

- **Render**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render configuration
- **Netlify**: Frontend deployment ready (see `netlify.toml`)
- **Railway**: Backend deployment ready

### Environment Variables

Make sure to set all required environment variables on your hosting platform:
- **Backend**: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
- **Frontend**: `VITE_API_BASE`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes with authentication middleware
- ✅ User ownership verification for tasks
- ✅ CORS configuration
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ Input validation and sanitization
- ✅ Environment variable protection

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use ESLint for code linting
- Format code consistently

### Git Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create a pull request

## 🐛 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Verify your `MONGODB_URI` is correct and your IP is whitelisted in MongoDB Atlas
- **Port Already in Use**: Change the `PORT` in `backend/.env`
- **JWT Errors**: Ensure `JWT_SECRET` is set and consistent

### Frontend Issues

- **API Connection Error**: Verify backend is running and `VITE_API_BASE` is correct
- **Build Errors**: Clear `node_modules` and reinstall dependencies
- **Type Errors**: Run `npm run lint` to identify issues

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
