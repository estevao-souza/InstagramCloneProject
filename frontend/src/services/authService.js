// Utils
import { api, requestConfig } from '../utils/config'

// Register User
const register = async (data) => {
  // Create POST Config with Data
  const config = requestConfig('POST', data)

  // Fetch Request
  try {
    const res = await fetch(api + '/users/register', config)
      .then((res) => res.json())
      .catch((err) => err)

    // Set Response to Local Storage if Successful
    if (res._id) {
      localStorage.setItem('user', JSON.stringify(res))
    }

    return res
  } catch (error) {
    console.log(error)
  }
}

// Login User
const login = async (data) => {
  // Create POST Config with Data
  const config = requestConfig('POST', data)

  // Fetch Request
  try {
    const res = await fetch(api + '/users/login', config)
      .then((res) => res.json())
      .catch((err) => err)

    // Set Response to Local Storage if Successful
    if (res._id) {
      localStorage.setItem('user', JSON.stringify(res))
    }

    return res
  } catch (error) {
    console.log(error)
  }
}

// Logout User
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  login,
  logout,
}

export default authService
