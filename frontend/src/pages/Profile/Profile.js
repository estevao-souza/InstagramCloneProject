// CSS
import './Profile.css'

// Utils
import { uploads } from '../../utils/config'

// React Router Config
import { useNavigate } from 'react-router-dom'

// Hooks
import { useState, useEffect, useRef } from 'react'
import { useScrollWindow } from '../../hooks/useScrollWindow'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { resetUserAuth } from '../../slices/authSlice'
import {
  profile,
  updateUser,
  deleteUser,
  reset,
  setError,
} from '../../slices/userSlice'

// Components
import RoundedImage from '../../components/RoundedImage/RoundedImage'
import Message from '../../components/Message/Message'
import ConfirmBox from '../../components/ConfirmBox/ConfirmBox'
import SpinnerLoader from '../../components/SpinnerLoader/SpinnerLoader'

const Profile = () => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [showConfirmBox, setShowConfirmBox] = useState(null)
  const photoRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const resetMessage = useResetComponentMessage(dispatch, reset)

  // Get Initial States from Store
  const { user, message, loading, error } = useSelector((state) => state.user)

  // Scroll Window to the Top when Open the Page
  useScrollWindow('top')

  // Scroll Window to the Top After Success or Error Message
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 3000)
  }, [message, error])

  // Load User Details
  useEffect(() => {
    // Call API by Slice
    dispatch(profile())
  }, [dispatch])

  // Fill Form with User Data
  useEffect(() => {
    // Check User
    if (user) {
      setName(user.name)
      setBio(user.bio)
    }
  }, [user])

  // Handle User Photo File
  const handlePhotoFile = (e) => {
    // Get Photo (Preview)
    const photo = e.target.files[0]

    // Check if there is a Photo
    if (!photo) {
      setPreviewPhoto('')
      setProfilePhoto('')
      return
    }

    // Validate Photo Format
    const validExtensions = ['.jpg', '.png']
    const filename = photo.name.toLowerCase()
    const fileExtension = filename.substring(filename.lastIndexOf('.'))
    if (!validExtensions.includes(fileExtension)) {
      // Scroll Window to the Bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

      // Send Error Message by Slice
      dispatch(setError('Please, upload only PNG or JPG Photos'))

      // Clean Photo Ref
      if (photoRef.current) {
        photoRef.current.value = ''
      }

      // Reset All User States (Message) after Timeout
      resetMessage()

      return
    }

    // Photo Preview
    setPreviewPhoto(photo)

    // Update User Photo
    setProfilePhoto(photo)
  }

  // Edit Profile Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // User Object
    const user = {}

    // Check Profile Photo
    if (profilePhoto) {
      user.profilePhoto = profilePhoto
    }

    // Set User Fields
    user.name = name

    // Check User Bio
    if (bio) {
      user.bio = bio
    }

    // Check Password
    if (password) {
      user.password = password
    }

    // Check Password Confirmation
    if (confirmPassword) {
      user.confirmPassword = confirmPassword
    }

    // Build Form Data
    const formData = new FormData()
    Object.keys(user).forEach((key) => formData.append(key, user[key]))

    // Call API by Slice
    dispatch(updateUser(formData))

    // Scroll Window to the Bottom
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

    // Reset All User States (Message) after Timeout
    resetMessage()
  }

  // Open Confirm Dialog
  const handleDelete = () => {
    setShowConfirmBox(true)
  }

  // Confirm Delete User Action (Delete User Handle Submit)
  const confirmDelete = async () => {
    // Call API by Slice and Wait Before Moving Forward
    await dispatch(deleteUser()).unwrap()

    // Delete User Auth Store
    dispatch(resetUserAuth())

    // Reset All User States (Message) after Timeout
    resetMessage()

    // Redirect to Home Page
    navigate('/')
  }

  // Cancel Delete User Action
  const cancelDelete = () => {
    // Close Confirm Dialog
    setShowConfirmBox(false)
  }

  // Loading Element
  if (loading) {
    return <SpinnerLoader />
  }

  return (
    <div id="profile">
      <div id="profile-header">
        <h2>Edit your profile</h2>
        <p id="profile-subtitle">
          Add a profile photo and tell more about yourself.
        </p>
        {((user && user.profilePhoto) || previewPhoto) && (
          <RoundedImage
            className="profile-photo"
            src={
              previewPhoto
                ? URL.createObjectURL(previewPhoto)
                : `${uploads}/users/${user.profilePhoto}`
            }
            alt={user.name}
          />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Profile Photo:</span>
          <input type="file" ref={photoRef} onChange={handlePhotoFile} />
        </label>
        <label>
          <span>Name:</span>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name || ''}
          />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Profile description"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ''}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label>
          <span>Password Confirmation:</span>
          <input
            type="password"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </label>
        {!loading && <input type="submit" value="Update" />}
        {loading && <input type="submit" value="Wait..." disabled />}
      </form>
      <div id="delete-container">
        <button
          className="cancel-button"
          onClick={() => {
            handleDelete()
          }}
        >
          Delete account
        </button>
      </div>
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}
      {showConfirmBox && (
        <ConfirmBox
          message="Are you sure you want to delete your user?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  )
}

export default Profile
