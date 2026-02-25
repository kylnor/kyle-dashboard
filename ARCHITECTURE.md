# Architecture Documentation

## Overview

Kyle Dashboard is a Next.js 14 application using the App Router architecture with server-side API routes and client-side components with SWR for data fetching.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **SWR** - Client-side data fetching with caching

### Backend
- **Next.js API Routes** - Serverless functions
- **Todoist REST API v2** - Task management data
- **GitHub REST API v3** - Repository and commit data

### Optional
- **Supabase** - PostgreSQL database for historical data

## Project Structure

```
kyle-dashboard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                     # API Routes (Server-side)
│   │   │   ├── github/
│   │   │   │   └── activity/
│   │   │   │       └── route.ts    # GitHub data aggregation
│   │   │   ├── todoist/
│   │   │   │   └── overview/
│   │   │   │       └── route.ts    # Todoist data aggregation
│   │   │   └── stats/
│   │   │       └── route.ts        # Combined metrics
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main dashboard page
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                  # React Components (Client-side)
│   │   ├── Card.tsx                # Reusable card UI
│   │   ├── Header.tsx              # Page header
│   │   ├── TodoistWidget.tsx       # Todoist display
│   │   ├── GitHubWidget.tsx        # GitHub display
│   │   └── ProductivityWidget.tsx  # Metrics display
│   │
│   ├── lib/                         # Utilities
│   │   ├── fetcher.ts              # SWR fetcher function
│   │   ├── supabase.ts             # Supabase client setup
│   │   └── utils.ts                # Helper functions
│   │
│   └── types/                       # TypeScript Definitions
│       └── dashboard.ts            # Type interfaces
│
├── public/                          # Static assets
├── .env.example                     # Environment template
├── .env.local                       # Local environment (git-ignored)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
└── next.config.js                   # Next.js config
```

## Data Flow

### 1. Client Request
```
User Browser → Next.js Page (SSR) → Client Component Renders
```

### 2. Data Fetching (SWR)
```
Client Component → useSWR Hook → API Route → External API → Response
                                                   ↓
                               Cache (5 min) ← JSON Data
```

### 3. Data Update Cycle
```
Every 5 minutes:
  SWR → Check Cache → Expired? → Refetch → Update UI
```

## API Routes Architecture

### `/api/github/activity`

**Purpose**: Aggregate GitHub data from multiple endpoints

**Process**:
1. Fetch user's repositories (sorted by recent updates)
2. Get recent commits from top 5 active repos
3. Calculate language distribution
4. Compute commit frequency
5. Return combined activity object

**Caching**: 5 minutes via Next.js `revalidate`

**Response**:
```typescript
{
  total_commits: number
  total_repos: number
  languages: Array<{name, count, percentage}>
  recent_commits: Array<GitHubCommit>
  active_repos: Array<GitHubRepository>
  commit_frequency: Array<{date, count}>
}
```

### `/api/todoist/overview`

**Purpose**: Aggregate Todoist task data

**Process**:
1. Fetch all active tasks from Todoist API
2. Fetch projects for name mapping
3. Calculate overdue, today, and upcoming counts
4. Group tasks by project and priority
5. Return overview statistics

**Caching**: 5 minutes via Next.js `revalidate`

**Response**:
```typescript
{
  overdue_count: number
  today_count: number
  upcoming_count: number
  total_active: number
  by_project: Array<ProjectStats>
  by_priority: Array<PriorityStats>
  overdue_tasks: Array<TodoistTask>
}
```

### `/api/stats`

**Purpose**: Combine data from both services and calculate metrics

**Process**:
1. Parallel fetch from `/api/github/activity` and `/api/todoist/overview`
2. Calculate commits today
3. Compute productivity score (0-100)
4. Return combined statistics

**Productivity Score Formula**:
```
tasksScore = min(today_tasks * 5, 50)     // Max 50 points
commitsScore = min(commits_today * 10, 50) // Max 50 points
productivityScore = tasksScore + commitsScore
```

## Component Architecture

### Client Components (`'use client'`)

All widgets are client components that use SWR for data fetching:

```typescript
const { data, error, isLoading } = useSWR<Type>(
  '/api/endpoint',
  fetcher,
  { refreshInterval: 300000 } // 5 minutes
)
```

**Benefits**:
- Automatic revalidation
- Error handling
- Loading states
- Optimistic updates
- Prevents duplicate requests

### Component States

1. **Loading**: Shows skeleton/spinner
2. **Error**: Displays error message
3. **Success**: Renders data with full UI
4. **Revalidating**: Background refresh (no UI change)

## Type System

### Core Types (`src/types/dashboard.ts`)

```typescript
// Todoist domain
interface TodoistTask { ... }
interface TodoistProject { ... }
interface TodoistOverview { ... }

// GitHub domain
interface GitHubCommit { ... }
interface GitHubRepository { ... }
interface GitHubActivity { ... }

// Dashboard metrics
interface DashboardStats { ... }
```

**Benefits**:
- Type safety across API boundaries
- IntelliSense support
- Compile-time error detection
- Self-documenting code

## Styling Architecture

### TailwindCSS Utility Classes

**Strategy**: Utility-first with component extraction where needed

**Color Scheme**:
- Primary: Blue (`primary-500`, `primary-600`)
- Status Colors:
  - Red: Overdue, errors
  - Green: Success, completed
  - Yellow: Warnings
  - Purple: Metrics, productivity

**Responsive Breakpoints**:
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

**Dark Mode**: Supported via `dark:` prefix

## Performance Optimizations

### 1. Data Caching
- **SWR Cache**: 5-minute client-side cache
- **Next.js Cache**: 5-minute server-side cache
- **Deduplication**: SWR prevents duplicate requests

### 2. API Rate Limiting
- **GitHub**: 5,000 requests/hour (authenticated)
- **Todoist**: 450 requests per 15 minutes
- **Dashboard Rate**: ~24 requests/hour (well within limits)

### 3. Parallel Requests
```typescript
// Both APIs called simultaneously
const [todoist, github] = await Promise.all([
  fetch('/api/todoist/overview'),
  fetch('/api/github/activity')
])
```

### 4. Lazy Loading
- Components render progressively
- Images/assets loaded on-demand
- Code splitting by route

## Security Considerations

### Environment Variables
- **Never** commit `.env.local`
- Use separate tokens for dev/prod
- Minimal token permissions

### API Token Storage
- Server-side only (not exposed to client)
- Accessed via `process.env`
- Encrypted in Vercel environment

### CORS & API Routes
- Next.js API routes act as proxy
- External APIs never exposed to client
- No CORS issues

## Error Handling

### API Route Errors
```typescript
try {
  // Fetch data
} catch (error) {
  console.error('API error:', error)
  return NextResponse.json(
    { error: 'Failed to fetch data' },
    { status: 500 }
  )
}
```

### Component Errors
```typescript
if (error) return <ErrorState />
if (isLoading) return <LoadingState />
return <DataDisplay data={data} />
```

## Deployment Architecture

### Vercel Platform

**Build Process**:
1. Install dependencies (`npm install`)
2. Build Next.js app (`npm run build`)
3. Generate static pages where possible
4. Deploy serverless functions

**Environment**:
- **Region**: Closest to user (auto-selected)
- **Functions**: Serverless (AWS Lambda)
- **Edge**: CDN for static assets
- **Env Vars**: Encrypted in Vercel dashboard

## Future Enhancements

### Planned Features
1. Historical data tracking (Supabase)
2. Contribution calendar/heatmap
3. Weekly summary emails
4. Mobile app (PWA)
5. Real-time updates (WebSockets)

### Scalability Considerations
- Database for historical trends
- Redis for faster caching
- GraphQL for flexible queries
- Batch API requests
- Webhook integrations

## Development Workflow

### Local Development
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Test production build
npm run lint     # Check code quality
```

### Git Workflow
```bash
git checkout -b feature/new-widget
# Make changes
git commit -m "Add new widget"
git push origin feature/new-widget
# Create PR on GitHub
```

### Deployment
```bash
git push origin main  # Auto-deploy to Vercel
```

## Monitoring & Debugging

### Development
- Next.js error overlay
- Console.log statements
- React DevTools
- Network tab inspection

### Production
- Vercel Analytics
- Vercel Logs
- Error boundaries
- Sentry (future)

---

**Last Updated**: 2026-02-25  
**Version**: 1.0.0
