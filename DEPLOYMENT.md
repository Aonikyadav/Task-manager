# Deployment Guide

This guide covers deploying Smart Task Flow to various platforms. Choose the option that best fits your needs.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

Vercel offers seamless deployment for both frontend and backend with zero configuration.

#### Deploy Backend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - A strong random secret (use: `openssl rand -base64 32`)
     - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)
     - `ADMIN_EMAIL` - Admin email (optional)
     - `ADMIN_PASSWORD` - Admin password (optional)
     - `ADMIN_NAME` - Admin name (optional)

5. **Redeploy** after adding environment variables

#### Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   vercel
   ```

2. **Set Environment Variables**:
   - `VITE_API_BASE` - Your backend API URL (e.g., `https://your-backend.vercel.app`)

3. **Update CORS in Backend**:
   - Update `FRONTEND_URL` in backend environment variables to match your frontend URL

---

### Option 2: Render (Free Tier Available)

Render provides free hosting for both backend and frontend.

#### Deploy to Render

1. **Create a Render Account**: https://render.com

2. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `smart-task-flow-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add environment variables (same as Vercel)
   - Click "Create Web Service"

3. **Deploy Frontend**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `smart-task-flow-frontend`
     - **Root Directory**: `.` (root)
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Add environment variable:
     - `VITE_API_BASE` - Your backend URL from step 2

4. **Update Backend CORS**:
   - Update `FRONTEND_URL` in backend environment variables

---

### Option 3: Netlify (Frontend) + Railway (Backend)

#### Deploy Frontend to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

4. **Set Environment Variables** in Netlify dashboard:
   - `VITE_API_BASE` - Your backend URL

#### Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app

2. **New Project** → "Deploy from GitHub repo"

3. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables** (same as Vercel)

---

## 📋 Environment Variables Checklist

### Backend Variables

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.com
PORT=5002 (or auto-assigned)
ADMIN_EMAIL=admin@example.com (optional)
ADMIN_PASSWORD=secure-password (optional)
ADMIN_NAME=Admin User (optional)
NODE_ENV=production
```

### Frontend Variables

```env
VITE_API_BASE=https://your-backend-url.com
```

---

## 🔧 Pre-Deployment Checklist

- [ ] Update `VITE_API_BASE` in frontend `.env` to production backend URL
- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Update `FRONTEND_URL` in backend to production frontend URL
- [ ] Ensure MongoDB Atlas allows connections from your deployment platform
- [ ] Test locally with production environment variables
- [ ] Build frontend: `npm run build`
- [ ] Verify `.gitignore` excludes `.env` files

---

## 🌐 MongoDB Atlas Configuration

1. **Whitelist IP Addresses**:
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (for cloud deployments)
   - Or add specific IPs for better security

2. **Database User**:
   - Ensure your database user has read/write permissions

---

## 🧪 Testing Deployment

### Test Backend

```bash
# Health check
curl https://your-backend-url.com/health

# Should return:
# {"status":"ok","timestamp":"...","database":"connected"}
```

### Test Frontend

1. Open your frontend URL in browser
2. Try registering a new account
3. Create a task
4. Verify all CRUD operations work

---

## 🔄 Continuous Deployment

### GitHub Integration

Most platforms support automatic deployments:

1. **Vercel**: Automatically deploys on push to main branch
2. **Render**: Enable "Auto-Deploy" in settings
3. **Netlify**: Auto-deploys from connected Git repo

### Manual Deployment

```bash
# Backend
cd backend
npm run build  # if needed
vercel --prod  # or platform-specific command

# Frontend
npm run build
vercel --prod  # or platform-specific command
```

---

## 🐛 Troubleshooting

### Backend Issues

- **Database Connection Failed**: Check MongoDB Atlas IP whitelist
- **CORS Errors**: Verify `FRONTEND_URL` matches your frontend domain
- **401 Unauthorized**: Check `JWT_SECRET` is set correctly

### Frontend Issues

- **API Calls Failing**: Verify `VITE_API_BASE` is correct
- **Build Errors**: Check Node.js version (should be 18+)
- **404 on Refresh**: Ensure redirect rules are configured (handled in configs)

---

## 📊 Platform Comparison

| Platform | Backend | Frontend | Free Tier | Ease of Use |
|----------|---------|----------|-----------|-------------|
| Vercel   | ✅      | ✅        | ✅         | ⭐⭐⭐⭐⭐    |
| Render   | ✅      | ✅        | ✅         | ⭐⭐⭐⭐      |
| Netlify  | ❌      | ✅        | ✅         | ⭐⭐⭐⭐      |
| Railway  | ✅      | ❌        | Limited    | ⭐⭐⭐       |

---

## 🎯 Recommended Setup

**For Beginners**: Vercel (both frontend and backend)
**For Free Tier**: Render (both services)
**For Maximum Control**: Railway (backend) + Netlify (frontend)

---

## 📝 Notes

- Always use HTTPS in production
- Never commit `.env` files to Git
- Use strong, unique `JWT_SECRET` in production
- Monitor your MongoDB Atlas usage
- Set up error tracking (e.g., Sentry) for production

---

Need help? Open an issue on GitHub!
