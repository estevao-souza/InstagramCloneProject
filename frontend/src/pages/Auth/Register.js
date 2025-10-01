// CSS
import './Auth.css'

// React Router Config
import { Link } from 'react-router-dom'

// Hooks
import { useState, useEffect } from 'react'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../../slices/authSlice'

// Component
import Message from '../../components/Message/Message'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const dispatch = useDispatch()
  const resetMessage = useResetComponentMessage(dispatch, reset)

  // Get Initial States from Store
  const { loading, error } = useSelector((state) => state.auth)

  // Register Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()

    // User Object
    const user = {
      name,
      email,
      password,
      confirmPassword,
    }

    // Call API by Slice
    dispatch(register(user))

    // Reset All Auth States (Message) after Timeout
    resetMessage()
  }

  // Reset All Auth States
  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  return (
    <div id="register">
      <h2>Instagram</h2>
      <p className="subtitle">Sign up to see your friends' posts.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
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
        <input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        {!loading && <input type="submit" value="Sign Up" />}
        {loading && <input type="submit" value="Wait..." disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  )
}

export default Register
