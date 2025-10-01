// React Router Config
import { useLocation } from 'react-router-dom'

// Hook
import { useMemo } from 'react'

export const useQuery = () => {
  // Get Query from URL
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}
