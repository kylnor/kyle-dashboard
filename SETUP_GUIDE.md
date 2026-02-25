# Setup Guide for Kyle Dashboard

This guide will walk you through setting up your personal dashboard with Todoist and GitHub integrations.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed
- [ ] A GitHub account with repositories
- [ ] A Todoist account with tasks/projects
- [ ] Terminal/command line access
- [ ] A code editor (VS Code recommended)

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/kylnor/kyle-dashboard.git
cd kyle-dashboard

# Install dependencies
npm install
```

### Step 2: Get Your API Tokens

#### GitHub Token (2 minutes)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it "Kyle Dashboard"
4. Select these scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:user` - Read user profile data
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

#### Todoist Token (1 minute)

1. Go to https://app.todoist.com/app/settings/integrations/developer
2. Scroll to "API token"
3. Click "Copy to clipboard"

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local in your editor
```

Add your tokens:

```env
# GitHub (Required)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=kylnor

# Todoist (Required)
TODOIST_API_TOKEN=your_todoist_token_here

# Supabase (Optional - skip for now)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Step 4: Start the Dashboard

```bash
npm run dev
```

Open http://localhost:3000 and see your dashboard! 🎉

## 🔍 Troubleshooting

### "Failed to fetch GitHub data"

**Problem**: Invalid GitHub token or insufficient permissions

**Solution**:
1. Check that your `GITHUB_TOKEN` is correctly copied (no extra spaces)
2. Verify your token has `repo` and `read:user` scopes
3. Test your token with curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
```

### "Failed to fetch Todoist data"

**Problem**: Invalid Todoist token

**Solution**:
1. Go back to Todoist settings and get a fresh token
2. Make sure you copied the entire token
3. Test your token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.todoist.com/rest/v2/tasks
```

### Dashboard shows loading forever

**Problem**: API routes not working

**Solution**:
1. Check that you're running `npm run dev`
2. Verify `.env.local` is in the root directory
3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again
4. Check the terminal for error messages

### TypeScript errors

**Problem**: Missing type definitions

**Solution**:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## 📊 What You'll See

### Productivity Widget (Top)
- Your productivity score (0-100)
- Today's commits and tasks
- Active repos and total tasks
- Smart insights based on your activity

### Todoist Widget (Bottom Left)
- Overdue tasks count (red alert if any)
- Tasks due today
- Upcoming tasks
- Breakdown by project
- Priority distribution
- List of overdue tasks

### GitHub Widget (Bottom Right)
- Total recent commits
- Total repositories
- Language distribution chart
- Most active repositories
- Recent commits with links

## 🎨 Customization Tips

### Change Your GitHub Username

Edit `.env.local`:
```env
GITHUB_USERNAME=your_actual_username
```

### Adjust Refresh Rate

Default is 5 minutes. To change, edit the widget files:

```typescript
// In src/components/TodoistWidget.tsx (and others)
useSWR('/api/todoist/overview', fetcher, {
  refreshInterval: 180000 // 3 minutes (180,000 ms)
})
```

### Modify Productivity Score Calculation

Edit `src/app/api/stats/route.ts`:

```typescript
// Current formula:
const tasksScore = Math.min((todoist?.today_count || 0) * 5, 50) // 5 pts per task
const commitsScore = Math.min(commitsToday * 10, 50) // 10 pts per commit

// Example: Value commits more
const tasksScore = Math.min((todoist?.today_count || 0) * 3, 30)
const commitsScore = Math.min(commitsToday * 7, 70)
```

## 🚀 Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "My dashboard setup"
git push origin main
```

2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables in Vercel:
   - `GITHUB_TOKEN`
   - `GITHUB_USERNAME`
   - `TODOIST_API_TOKEN`
5. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add production environment variables
vercel env add GITHUB_TOKEN
vercel env add GITHUB_USERNAME
vercel env add TODOIST_API_TOKEN

# Deploy to production
vercel --prod
```

## 🔐 Security Best Practices

### Protect Your Tokens

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Use environment variables in production (Vercel)
- ✅ Regenerate tokens if accidentally exposed
- ✅ Use separate tokens for development and production

### Token Permissions

- GitHub token only needs `repo` and `read:user` scopes
- Don't give unnecessary permissions
- Regularly review and rotate tokens

## 📈 Next Steps

### Add More Features

1. **Historical Data**: Set up Supabase to track data over time
2. **Charts**: Add Recharts for commit frequency graphs
3. **Notifications**: Get alerts for overdue tasks
4. **Mobile App**: Make it a PWA for mobile access

### Integrate More Services

- **Calendar**: Google Calendar or Outlook
- **Email**: Gmail or Superhuman stats
- **Fitness**: Strava or Apple Health
- **Time Tracking**: Toggle or RescueTime

## 🆘 Getting Help

### Common Issues

**Port 3000 already in use**
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Build errors**
```bash
# Check TypeScript
npm run build
```

### Still Stuck?

1. Check the [Next.js docs](https://nextjs.org/docs)
2. Review the [SWR documentation](https://swr.vercel.app/)
3. Open an issue on GitHub

## 📝 Daily Usage Tips

### Best Practices

1. **Morning Routine**: Check overdue tasks first
2. **Throughout Day**: Dashboard auto-refreshes every 5 minutes
3. **Evening**: Review productivity score
4. **Weekly**: Check GitHub language distribution trends

### Keyboard Shortcuts

- `Cmd/Ctrl + R` - Refresh page
- `Cmd/Ctrl + K` - (Add later) Quick command menu
- `Cmd/Ctrl + ,` - (Add later) Settings

## 🎉 You're All Set!

Your dashboard should now be showing:
- ✅ Your GitHub activity
- ✅ Your Todoist tasks
- ✅ Your productivity score

Enjoy your new productivity command center! 🚀
