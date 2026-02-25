// Default fetcher function for SWR
export const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Example usage with SWR:
// import useSWR from 'swr'
// import { fetcher } from '@/lib/fetcher'
//
// const { data, error, isLoading } = useSWR('/api/data', fetcher)
