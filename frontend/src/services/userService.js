// Utils
import { api, requestConfig } from '../utils/config'

// Get Current Logged User
const profile = async (token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/users/profile', config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Update User
const updateUser = async (data, token) => {
  // Create Patch Config with Data, Token and Image
  const config = requestConfig('PATCH', data, token, true)

  // Fetch Request
  try {
    const res = await fetch(api + '/users', config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Delete User
const deleteUser = async (token) => {
  // Create Delete Config with No Data and Token
  const config = requestConfig('DELETE', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/users', config)
      .then((res) => res.json())
      .catch((err) => err)

    // Remove User Store
    localStorage.removeItem('user')

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get User by ID
const getUserDetails = async (id, token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/users/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const userService = {
  profile,
  updateUser,
  deleteUser,
  getUserDetails,
}

export default userService
