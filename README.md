# Kyle Dashboard

A modern, responsive personal productivity dashboard built with Next.js 14, TypeScript, and TailwindCSS. Integrates with Todoist for task management and GitHub for development activity tracking.

## ✨ Features

- ⚡️ **Next.js 14** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **TailwindCSS** for styling
- 📊 **SWR** for data fetching and caching
- 📋 **Todoist Integration** - Track tasks, projects, and overdue items
- 💻 **GitHub Integration** - Monitor commits, repos, and language stats
- 🎯 **Productivity Metrics** - Combined scoring system
- 📱 **Fully Responsive** design
- 🔄 **Auto-refresh** data every 5 minutes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Todoist account and API token
- GitHub personal access token
- (Optional) Supabase project for data storage

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kylnor/kyle-dashboard.git
cd kyle-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# GitHub Configuration (Required)
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_USERNAME=kylnor

# Todoist Configuration (Required)
TODOIST_API_TOKEN=your-todoist-api-token
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🔑 Getting API Tokens

### GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
4. Copy the token and add to `.env.local`

### Todoist API Token

1. Go to Todoist Settings → Integrations → Developer
2. Copy your API token
3. Add to `.env.local`

### Supabase Setup (Optional)

If you want to store historical data:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Add to `.env.local`

## 📊 Dashboard Widgets

### Productivity Widget
- **Productivity Score** (0-100) based on commits and task completion
- **Today's Activity** - Commits and tasks due today
- **Active Repos** and **Total Tasks** overview
- **Quick Insights** with personalized recommendations

### Todoist Widget
- **Overdue Tasks** count with red alert
- **Due Today** and **Upcoming** task counts
- **Tasks by Project** breakdown (top 5)
- **Priority Distribution** visualization
- **Overdue Tasks Preview** with details

### GitHub Widget
- **Recent Commits** count across all repos
- **Language Distribution** with percentages
- **Active Repositories** (top 5 by recent updates)
- **Recent Commits** timeline with links
- **Repository Stats** (stars, forks, issues)

## 🏗️ Project Structure

```
kyle-dashboard/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── github/       # GitHub activity endpoint
│   │   │   ├── todoist/      # Todoist data endpoint
│   │   │   └── stats/        # Combined metrics endpoint
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dashboard
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── Card.tsx          # Reusable card component
│   │   ├── Header.tsx        # Page header
│   │   ├── TodoistWidget.tsx # Todoist integration
│   │   ├── GitHubWidget.tsx  # GitHub integration
│   │   └── ProductivityWidget.tsx # Metrics display
│   ├── lib/                   # Utilities
│   │   ├── fetcher.ts        # SWR fetcher
│   │   └── supabase.ts       # Supabase client
│   └── types/                 # TypeScript types
│       └── dashboard.ts       # Dashboard data types
├── public/                    # Static assets
├── .env.example              # Environment template
└── ...config files
```

## 🎨 Customization

### Update GitHub Username
Change in `.env.local`:
```env
GITHUB_USERNAME=your-github-username
```

### Adjust Refresh Interval
In widget components, modify the `refreshInterval`:
```typescript
useSWR('/api/endpoint', fetcher, {
  refreshInterval: 300000 // 5 minutes in milliseconds
})
```

### Customize Productivity Score
Edit `src/app/api/stats/route.ts`:
```typescript
const tasksScore = Math.min((todoist?.today_count || 0) * 5, 50)
const commitsScore = Math.min(commitsToday * 10, 50)
```

### Add More Widgets
1. Create component in `src/components/`
2. Import in `src/app/page.tsx`
3. Add to grid layout

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel

Add all variables from `.env.local` to Vercel:
- Settings → Environment Variables
- Add each key-value pair
- Redeploy

## 📈 Features Roadmap

- [ ] Historical data tracking with Supabase
- [ ] Contribution heatmap/calendar
- [ ] Task completion trends
- [ ] Commit frequency charts
- [ ] Project time tracking
- [ ] Weekly summary reports
- [ ] Dark mode toggle
- [ ] Mobile app (PWA)

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Database** (Optional): [Supabase](https://supabase.com/)
- **APIs**: Todoist REST API, GitHub REST API

## 📝 API Rate Limits

- **GitHub**: 5,000 requests/hour (authenticated)
- **Todoist**: 450 requests per 15 minutes
- Dashboard caches data for 5 minutes to stay well within limits

## 🤝 Contributing

This is a personal dashboard, but feel free to fork and customize for your own use!

## 📄 License

MIT

## 🔗 Links

- [Todoist API Docs](https://developer.todoist.com/rest/v2/)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Next.js Docs](https://nextjs.org/docs)
- [SWR Docs](https://swr.vercel.app/)

---

**Built with ❤️ by Kyle Northup**  
*Salt Lake City, UT*
