# 🚀 Deploy Now - Step by Step Guide

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free)
2. **MongoDB Atlas**: Your MongoDB connection string ready
3. **GitHub Account**: (Optional, but recommended for auto-deploy)

## Quick Deploy (5 minutes)

### Step 1: Login to Vercel

```powershell
vercel login
```

This will open your browser. Click "Authorize" to connect your account.

### Step 2: Deploy Backend

```powershell
cd backend
vercel
```

**When prompted:**
- ✅ Set up and deploy? → **Yes**
- ❌ Link to existing project? → **No** (first time)
- 📝 Project name → **smart-task-flow-backend**
- 📁 Directory → **./** (current directory)

**After deployment, copy your backend URL** (e.g., `https://smart-task-flow-backend.vercel.app`)

### Step 3: Configure Backend Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on **smart-task-flow-backend** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
MONGODB_URI = mongodb+srv://your-connection-string
JWT_SECRET = (generate with: openssl rand -base64 32)
FRONTEND_URL = (we'll update this after frontend deploy)
NODE_ENV = production
```

5. Click **Save**

### Step 4: Deploy Frontend

```powershell
cd ..
vercel
```

**When prompted:**
- ✅ Set up and deploy? → **Yes**
- ❌ Link to existing project? → **No** (first time)
- 📝 Project name → **smart-task-flow-frontend**
- 📁 Directory → **./** (root directory)

**After deployment, copy your frontend URL** (e.g., `https://smart-task-flow-frontend.vercel.app`)

### Step 5: Configure Frontend Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on **smart-task-flow-frontend** project
3. Go to **Settings** → **Environment Variables**
4. Add:

```
VITE_API_BASE = https://smart-task-flow-backend.vercel.app
```
(Use your actual backend URL from Step 2)

5. Click **Save**

### Step 6: Update Backend CORS

1. Go back to **smart-task-flow-backend** project
2. Go to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL = https://smart-task-flow-frontend.vercel.app
   ```
4. Go to **Deployments** tab
5. Click **⋯** (three dots) on latest deployment
6. Click **Redeploy**

### Step 7: Redeploy Frontend

1. Go to **smart-task-flow-frontend** project
2. Go to **Deployments** tab
3. Click **⋯** (three dots) on latest deployment
4. Click **Redeploy**

## ✅ Test Your Deployment

1. Open your frontend URL in browser
2. Register a new account
3. Create a task
4. Everything should work! 🎉

## 🔑 Generate JWT Secret

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

## 📋 Environment Variables Checklist

### Backend (`smart-task-flow-backend`)
- ✅ `MONGODB_URI` - Your MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Strong random secret (32+ characters)
- ✅ `FRONTEND_URL` - Your frontend Vercel URL
- ✅ `NODE_ENV` - `production`

### Frontend (`smart-task-flow-frontend`)
- ✅ `VITE_API_BASE` - Your backend Vercel URL

## 🆘 Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Check MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs (or Vercel's IPs)

**CORS Errors:**
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Include `https://` in the URL

### Frontend Issues

**API Calls Failing:**
- Verify `VITE_API_BASE` is correct
- Make sure backend is deployed and running
- Check browser console for errors

**404 on Refresh:**
- This is handled automatically by `vercel.json` configuration

## 🎯 Auto-Deploy from GitHub

1. Push your code to GitHub
2. In Vercel dashboard, go to project settings
3. Connect your GitHub repository
4. Every push to `main` branch will auto-deploy!

## 📞 Need Help?

- Check deployment logs in Vercel dashboard
- Verify all environment variables are set
- Check MongoDB Atlas connection settings
- Review `DEPLOYMENT.md` for detailed instructions

---

**Ready to deploy? Run the commands above! 🚀**
