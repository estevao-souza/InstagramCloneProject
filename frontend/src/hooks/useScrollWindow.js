// Hook
import { useEffect } from 'react'

export const useScrollWindow = (direction) => {
  useEffect(() => {
    window.scrollTo({
      top: direction === 'bottom' ? document.body.scrollHeight : 0,
      behavior: 'smooth',
    })
  }, [])
}
