// CSS
import './Navbar.css'

// React Icons
import { BsSearch } from 'react-icons/bs'
import {
  IoHomeSharp,
  IoPersonSharp,
  IoSettingsSharp,
  IoLogOutSharp,
} from 'react-icons/io5'

// React Router Config
import { NavLink, Link, useNavigate } from 'react-router-dom'

// Hooks
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

// Redux
import { useDispatch } from 'react-redux'
import { logout, reset } from '../../slices/authSlice'

const Navbar = () => {
  const { auth, user } = useAuth()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Handle Log Out
  const handleLogout = () => {
    // Call Slice Action
    dispatch(logout())

    // Reset All Auth States
    dispatch(reset())

    // Redirect to Login Page
    navigate('/login')
  }

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault()

    if (query.trim()) {
      navigate(`/search?q=${query}`)

      setQuery('')
    }
  }

  return (
    <nav id="nav">
      <Link to="/">Instagram</Link>
      <form id="search-form" onSubmit={handleSearch}>
        <BsSearch />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <NavLink to="/">
                <IoHomeSharp />
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to={`/user/${user._id}`}>
                  <IoPersonSharp />
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to={'/profile'}>
                <IoSettingsSharp />
              </NavLink>
            </li>
            <li>
              <IoLogOutSharp onClick={handleLogout} />
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/signin">Sign In</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
