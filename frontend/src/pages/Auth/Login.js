// CSS
import './Auth.css'

// React Router Config
import { Link } from 'react-router-dom'

// Hooks
import { useState, useEffect } from 'react'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../../slices/authSlice'

// Component
import Message from '../../components/Message/Message'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const resetMessage = useResetComponentMessage(dispatch, reset)

  // Get Initial States from Store
  const { loading, error } = useSelector((state) => state.auth)

  // Login Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()

    // User Object
    const user = {
      email,
      password,
    }

    // Call API by Slice
    dispatch(login(user))

    // Reset All Auth States (Message) after Timeout
    resetMessage()
  }

  // Reset All Auth States
  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  return (
    <div id="login">
      <h2>Instagram</h2>
      <p className="subtitle">Sign in to see what's new.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {!loading && <input type="submit" value="Sign In" />}
        {loading && <input type="submit" value="Wait..." disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  )
}

export default Login
