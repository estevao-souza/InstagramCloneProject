// CSS
import './App.css'

// React Router Config
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Hooks
import { useAuth } from './hooks/useAuth'

// Components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import SpinnerLoader from './components/SpinnerLoader/SpinnerLoader'

// Pages
import Home from './pages/Home/Home'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import ProfileDetails from './pages/ProfileDetails/ProfileDetails'
import PostDetails from './pages/PostDetails/PostDetails'
import Search from './pages/Search/Search'

function App() {
  // Get User Authentication
  const { auth, loading } = useAuth()

  // Loading Element
  if (loading) {
    return <SpinnerLoader />
  }

  return (
    <div id="App">
      <BrowserRouter>
        <Navbar />
        <div id="container">
          <Routes>
            <Route
              path="/"
              element={auth ? <Home /> : <Navigate to="/signin" />}
            />
            <Route
              path="/signup"
              element={!auth ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/signin"
              element={!auth ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={auth ? <Profile /> : <Navigate to="/signin" />}
            />
            <Route
              path="/user/:id"
              element={auth ? <ProfileDetails /> : <Navigate to="/signin" />}
            />
            <Route
              path="/post/:id"
              element={auth ? <PostDetails /> : <Navigate to="/signin" />}
            />
            <Route
              path="/search"
              element={auth ? <Search /> : <Navigate to="/signin" />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
