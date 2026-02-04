# Vercel Deployment Script for Smart Task Flow
# Run this script to deploy both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Smart Task Flow - Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to login to Vercel first." -ForegroundColor Red
    Write-Host ""
    Write-Host "Step 1: Login to Vercel" -ForegroundColor Green
    Write-Host "Run: vercel login" -ForegroundColor Yellow
    Write-Host "This will open your browser for authentication." -ForegroundColor Gray
    Write-Host ""
    Write-Host "After logging in, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Logged in to Vercel" -ForegroundColor Green
Write-Host ""

# Deploy Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Deploying Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Navigate to backend directory..." -ForegroundColor Yellow
Set-Location backend

Write-Host "Starting backend deployment..." -ForegroundColor Yellow
Write-Host "When prompted:" -ForegroundColor Gray
Write-Host "  - Set up and deploy? → Yes" -ForegroundColor Gray
Write-Host "  - Link to existing project? → No" -ForegroundColor Gray
Write-Host "  - Project name → smart-task-flow-backend" -ForegroundColor Gray
Write-Host "  - Directory → ./" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to start backend deployment..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

vercel --prod

Write-Host ""
Write-Host "✓ Backend deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Copy your backend URL from above (e.g., https://smart-task-flow-backend.vercel.app)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key after you've copied the backend URL..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Go back to root
Set-Location ..

# Deploy Frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Deploying Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting frontend deployment..." -ForegroundColor Yellow
Write-Host "When prompted:" -ForegroundColor Gray
Write-Host "  - Set up and deploy? → Yes" -ForegroundColor Gray
Write-Host "  - Link to existing project? → No" -ForegroundColor Gray
Write-Host "  - Project name → smart-task-flow-frontend" -ForegroundColor Gray
Write-Host "  - Directory → ./" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to start frontend deployment..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

vercel --prod

Write-Host ""
Write-Host "✓ Frontend deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "2. Select 'smart-task-flow-backend' project" -ForegroundColor Yellow
Write-Host "3. Go to Settings → Environment Variables" -ForegroundColor Yellow
Write-Host "4. Add these variables:" -ForegroundColor Yellow
Write-Host "   - MONGODB_URI = your-mongodb-connection-string" -ForegroundColor Gray
Write-Host "   - JWT_SECRET = (generate with: openssl rand -base64 32)" -ForegroundColor Gray
Write-Host "   - FRONTEND_URL = (your frontend URL from step 2)" -ForegroundColor Gray
Write-Host "   - NODE_ENV = production" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Select 'smart-task-flow-frontend' project" -ForegroundColor Yellow
Write-Host "6. Go to Settings → Environment Variables" -ForegroundColor Yellow
Write-Host "7. Add:" -ForegroundColor Yellow
Write-Host "   - VITE_API_BASE = (your backend URL from step 1)" -ForegroundColor Gray
Write-Host ""
Write-Host "8. Redeploy both projects after adding environment variables" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your app will be live! 🚀" -ForegroundColor Green
