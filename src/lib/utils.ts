/**
 * Format a date string to relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  
  return date.toLocaleDateString()
}

/**
 * Format a date to MST timezone
 */
export function formatMST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    timeZone: 'America/Denver',
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

/**
 * Get greeting based on time of day (MST)
 */
export function getGreeting(): string {
  const hour = new Date().toLocaleString('en-US', {
    timeZone: 'America/Denver',
    hour: 'numeric',
    hour12: false
  })
  const hourNum = parseInt(hour)

  if (hourNum < 5) return 'Working late'
  if (hourNum < 12) return 'Good morning'
  if (hourNum < 17) return 'Good afternoon'
  if (hourNum < 22) return 'Good evening'
  return 'Working late'
}

/**
 * Calculate percentage with optional decimal places
 */
export function calculatePercentage(value: number, total: number, decimals: number = 0): number {
  if (total === 0) return 0
  const percentage = (value / total) * 100
  return Number(percentage.toFixed(decimals))
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Format number with commas (e.g., 1234 -> 1,234)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Get color class for Todoist priority
 */
export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 4: return 'red'
    case 3: return 'orange'
    case 2: return 'blue'
    default: return 'gray'
  }
}

/**
 * Get label for Todoist priority
 */
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 4: return 'P1 (Urgent)'
    case 3: return 'P2 (High)'
    case 2: return 'P3 (Medium)'
    default: return 'P4 (Low)'
  }
}

/**
 * Get color for programming language
 */
export function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    TypeScript: 'blue-600',
    JavaScript: 'yellow-500',
    Python: 'green-600',
    Java: 'red-600',
    HTML: 'orange-500',
    CSS: 'purple-500',
    Go: 'cyan-500',
    Rust: 'orange-700',
    Ruby: 'red-700',
    PHP: 'indigo-600',
    Swift: 'orange-600',
    Kotlin: 'purple-700',
  }
  return colors[language] || 'gray-500'
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateString.split('T')[0] === today
}

/**
 * Check if date is overdue
 */
export function isOverdue(dateString: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateString.split('T')[0] < today
}

/**
 * Get productivity level based on score
 */
export function getProductivityLevel(score: number): {
  level: string
  color: string
  emoji: string
  message: string
} {
  if (score >= 80) {
    return {
      level: 'Excellent',
      color: 'green',
      emoji: '🔥',
      message: 'On fire!'
    }
  }
  if (score >= 60) {
    return {
      level: 'Good',
      color: 'blue',
      emoji: '💪',
      message: 'Good momentum'
    }
  }
  if (score >= 40) {
    return {
      level: 'Moderate',
      color: 'yellow',
      emoji: '⚡',
      message: 'Getting started'
    }
  }
  if (score >= 20) {
    return {
      level: 'Low',
      color: 'orange',
      emoji: '☕',
      message: 'Time to focus'
    }
  }
  return {
    level: 'Very Low',
    color: 'red',
    emoji: '😴',
    message: 'Need a boost'
  }
}
