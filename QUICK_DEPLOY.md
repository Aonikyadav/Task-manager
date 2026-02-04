# 🚀 Quick Deployment Guide

## Fastest Way: Deploy with Vercel (5 minutes)

### Step 1: Deploy Backend

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```
   - Follow the prompts
   - When asked "Set up and deploy?", choose **Yes**
   - When asked "Which scope?", choose your account
   - When asked "Link to existing project?", choose **No**
   - When asked "What's your project's name?", enter: `smart-task-flow-backend`
   - When asked "In which directory is your code located?", enter: `./`

3. **Add Environment Variables**:
   - Go to https://vercel.com/dashboard
   - Select your project: `smart-task-flow-backend`
   - Go to **Settings** → **Environment Variables**
   - Add these variables:
     ```
     MONGODB_URI = your-mongodb-connection-string
     JWT_SECRET = generate-with: openssl rand -base64 32
     FRONTEND_URL = https://your-frontend-url.vercel.app (we'll update this)
     NODE_ENV = production
     ```
   - Click **Save**

4. **Copy Backend URL**:
   - After deployment, copy your backend URL (e.g., `https://smart-task-flow-backend.vercel.app`)
   - You'll need this for the frontend

### Step 2: Deploy Frontend

1. **Go back to root directory**:
   ```bash
   cd ..
   ```

2. **Deploy Frontend**:
   ```bash
   vercel
   ```
   - Follow similar prompts
   - Project name: `smart-task-flow-frontend`

3. **Add Environment Variable**:
   - Go to your frontend project settings on Vercel
   - **Settings** → **Environment Variables**
   - Add:
     ```
     VITE_API_BASE = https://smart-task-flow-backend.vercel.app
     ```
   - Click **Save**

4. **Copy Frontend URL**:
   - Copy your frontend URL (e.g., `https://smart-task-flow-frontend.vercel.app`)

### Step 3: Update Backend CORS

1. **Go back to backend project** on Vercel
2. **Settings** → **Environment Variables**
3. **Update** `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL = https://smart-task-flow-frontend.vercel.app
   ```
4. **Redeploy** backend (go to Deployments → click "..." → Redeploy)

### Step 4: Test Your Deployment

1. Open your frontend URL in browser
2. Register a new account
3. Create a task
4. Everything should work! 🎉

---

## Alternative: Deploy with Render (Free)

### Backend

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-task-flow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables (same as Vercel)
6. Click **Create Web Service**

### Frontend

1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `smart-task-flow-frontend`
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_BASE` = your backend URL
5. Click **Create Static Site**

---

## 🔑 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

---

## ✅ Checklist

- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0` (or your platform's IPs)
- [ ] Backend deployed and environment variables set
- [ ] Frontend deployed with `VITE_API_BASE` pointing to backend
- [ ] Backend `FRONTEND_URL` updated to frontend URL
- [ ] Tested registration and login
- [ ] Tested creating tasks

---

## 🆘 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Verify environment variables are set correctly
- Check MongoDB Atlas connection settings
- Review platform logs for errors

---

**That's it! Your app should be live! 🚀**
