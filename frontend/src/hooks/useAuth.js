// Hooks
import { useState, useEffect } from 'react'

// Redux
import { useSelector } from 'react-redux'

export const useAuth = () => {
  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  // Get User from Store
  const { user } = useSelector((state) => state.auth)

  // Verify User State in Every Change
  useEffect(() => {
    if (user) {
      setAuth(true)
    } else {
      setAuth(false)
    }

    setLoading(false)
  }, [user])

  return { auth, user, loading }
}
