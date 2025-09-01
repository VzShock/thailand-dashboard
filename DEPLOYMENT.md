# Deployment Guide for Thailand Adventure Dashboard

This guide provides step-by-step instructions for deploying the Thailand Adventure Dashboard to Netlify.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account with the repository pushed
- A Netlify account (free tier is sufficient)
- Node.js 18+ installed locally (for testing)

## Deployment to Netlify

### Method 1: Deploy via Netlify UI (Recommended)

1. **Log in to Netlify**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories

3. **Select Repository**
   - Find and select `thailand-dashboard` from your repositories
   - If not visible, click "Configure the Netlify app on GitHub" to grant access

4. **Configure Build Settings**
   Netlify should auto-detect Next.js settings, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 (set in netlify.toml)

5. **Deploy Site**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at a random Netlify URL

6. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add a custom domain if desired

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   # In the project directory
   netlify init
   
   # Follow prompts to connect to GitHub
   # Choose "Create & configure a new site"
   
   # Deploy
   netlify deploy --prod
   ```

## Important Notes on Data Persistence

### How Data Works in Production vs Development

**Local Development**:
- API routes can read/write to `data/` directory
- Changes to tracker data are saved to `data/shared-tracker.json`
- Full functionality with server-side persistence

**Production (Netlify)**:
- Netlify has a **read-only filesystem**
- Static JSON files in `data/` are deployed and serve as initial data
- User interactions are saved to **localStorage only**
- Each visitor gets their own progress tracking in their browser
- The `/api/tracker` endpoint will fail to write but localStorage fallback ensures functionality

### Data Flow
1. Initial data loads from static JSON files
2. User makes changes (checks items, updates progress)
3. Changes attempt to save to API (fails on Netlify)
4. Automatic fallback saves to localStorage
5. User's progress persists in their browser

### Updating Production Data
To update the initial data that all users see:
1. Run the app locally
2. Make your changes
3. Commit and push to GitHub
4. Netlify will automatically redeploy with new data

## Environment Variables

No environment variables are required for basic functionality. If you want to add features requiring secrets:

1. Go to Site settings → Environment variables
2. Add variables as needed
3. Redeploy for changes to take effect

## Build Configuration

The `netlify.toml` file includes:
- Build command and publish directory
- Node.js version specification
- Security headers
- Next.js plugin configuration
- Redirect rules for proper routing

## Troubleshooting

### Build Failures

If the build fails, check:
1. **Node version**: Ensure Node 18+ is specified
2. **Dependencies**: Run `npm install` locally and commit `package-lock.json`
3. **Build logs**: Check Netlify dashboard for detailed error messages

### 404 Errors on Routes

If you get 404 errors on routes:
1. Ensure `netlify.toml` is present and properly configured
2. Check that the Next.js plugin is installed
3. Clear cache and redeploy

### Data Not Persisting

Remember:
- Data only persists in the user's browser (localStorage)
- Each browser/device has its own data
- Clearing browser data will reset progress
- This is expected behavior on Netlify

## Monitoring

### Build Status
- Check build status at Netlify dashboard
- Enable build notifications in Site settings

### Analytics (Optional)
- Enable Netlify Analytics for visitor insights
- No code changes required

## Continuous Deployment

Netlify automatically deploys when you:
- Push to the main branch
- Merge a pull request to main

To disable auto-deploy:
1. Go to Site settings → Build & deploy
2. Stop auto publishing

## Performance Optimization

The app is optimized for Netlify with:
- Next.js automatic optimizations
- Static generation where possible
- Efficient client-side data handling
- CDN distribution of assets

## Support

For deployment issues:
- Check [Netlify Status](https://www.netlifystatus.com/)
- Review [Netlify Docs](https://docs.netlify.com/)
- Check build logs in Netlify dashboard

## Summary

Your Thailand Adventure Dashboard will work perfectly on Netlify with:
✅ Full UI functionality
✅ localStorage persistence for user data
✅ Static data serving
✅ Responsive design
✅ Offline capability

The only limitation is that data changes made by visitors won't persist server-side, which is perfect for a personal travel planning app where you control the main data through local development.