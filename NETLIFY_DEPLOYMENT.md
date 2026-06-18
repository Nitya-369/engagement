# Netlify Deployment Guide

This project is now configured for Netlify deployment! 🎉

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Go to [Netlify](https://app.netlify.com/)**
   - Sign in or create an account
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect the build settings from `netlify.toml`
   - Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Option 3: Drag and Drop (Manual)

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Go to [Netlify Drop](https://app.netlify.com/drop)**
   - Drag and drop the `dist/client` folder
   - Your site will be deployed instantly

## Configuration

The project includes:
- ✅ `netlify.toml` - Build configuration
- ✅ `public/_redirects` - SPA routing rules
- ✅ Post-build script - Generates index.html with correct asset paths

## Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist/client`
- **Node version**: 20

## Environment Variables

No environment variables are required for this project.

## Custom Domain

After deployment, you can add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Troubleshooting

If the site doesn't load properly:
1. Check the deploy logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Clear cache and redeploy: `netlify deploy --prod --clear-cache`

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:8080

---

For more information, see the [Netlify documentation](https://docs.netlify.com/).
