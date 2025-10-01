// CSS
import './ProfileDetails.css'

// Utils
import { uploads, noUserPhoto } from '../../utils/config'

// React Router Config
import { Link, useParams } from 'react-router-dom'

// Hooks
import { useState, useEffect, useRef } from 'react'
import { useScrollWindow } from '../../hooks/useScrollWindow'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails } from '../../slices/userSlice'
import {
  getAllUserPosts,
  publishPost,
  updatePost,
  deletePost,
  reset,
  setError,
} from '../../slices/postSlice'

// Components
import RoundedImage from '../../components/RoundedImage/RoundedImage'
import Message from '../../components/Message/Message'
import ConfirmBox from '../../components/ConfirmBox/ConfirmBox'
import SpinnerLoader from '../../components/SpinnerLoader/SpinnerLoader'

// React Icons
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs'

const Profile = () => {
  const { id } = useParams()
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [title, setTitle] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [photo, setPhoto] = useState('')
  const [editPhoto, setEditPhoto] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [showConfirmBox, setShowConfirmBox] = useState(null)
  const photoRef = useRef(null)
  const newPostButton = useRef()
  const newPostForm = useRef()
  const editPostForm = useRef()
  const dispatch = useDispatch()
  const resetMessage = useResetComponentMessage(dispatch, reset)

  // Get Initial States from Store
  const { user: userAuth } = useSelector((state) => state.auth)
  const { user: userProfile, loading: loadingUser } = useSelector(
    (state) => state.user
  )
  const {
    posts,
    loading: loadingPost,
    message: messagePost,
    error: errorPost,
  } = useSelector((state) => state.post)

  // Scroll Window to the Top when Open the Page
  useScrollWindow('top')

  // Scroll Window to the Top After Success or Error Message
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [messagePost, errorPost])

  // Load User Profile and Posts Data
  useEffect(() => {
    // Clean Post Messages when Page is Open
    dispatch(reset())

    // Call APIs by Slice
    dispatch(getUserDetails(id))
    dispatch(getAllUserPosts(id))
  }, [dispatch, id])

  // Handle Post Photo File
  const handlePhotoFile = (e) => {
    // Get Photo (Preview)
    const photo = e.target.files[0]

    // Check if there is a Photo
    if (!photo) {
      setPreviewPhoto('')
      setPhoto('')
      return
    }

    // Validate Photo Format
    const validExtensions = ['.jpg', '.png']
    const filename = photo.name.toLowerCase()
    const fileExtension = filename.substring(filename.lastIndexOf('.'))
    if (!validExtensions.includes(fileExtension)) {
      // Send Error Message by Slice
      dispatch(setError('Please, upload only PNG or JPG Photos'))

      // Clean Photo Ref
      if (photoRef.current) {
        photoRef.current.value = ''
      }

      // Reset All Post States (Message) after Timeout
      resetMessage()

      return
    }

    // Photo Preview
    setPreviewPhoto(photo)

    // Post Photo
    setPhoto(photo)
  }

  // Handle Cancel New Post Form
  const handleNewForm = () => {
    // Clean New Post Form Fields
    setTitle('')
    setPhoto('')
    setPreviewPhoto('')

    // Clean Photo Ref
    if (photoRef.current) {
      photoRef.current.value = ''
    }

    // Call Hide or Show Form Method
    hideOrShowForm('new')
  }

  // Handle Cancel Edit Post Form
  const handleEditForm = () => {
    // Call Hide or Show Form Method
    hideOrShowForm('edit')
  }

  // Show or Hide Forms
  const hideOrShowForm = (post) => {
    // First: Toggle Forms
    if (post === 'new') {
      newPostForm.current.classList.toggle('hide')
      editPostForm.current.classList.add('hide') // Always hide the other one
    }

    if (post === 'edit') {
      editPostForm.current.classList.toggle('hide')
      newPostForm.current.classList.add('hide') // Always hide the other one
    }

    // Last: Check if Button Shown
    if (
      !newPostForm.current.classList.contains('hide') ||
      !editPostForm.current.classList.contains('hide')
    ) {
      newPostButton.current.classList.add('hide') // Hide Button if Any Form is Open
    } else {
      newPostButton.current.classList.remove('hide') // Show Button if Both Forms are Closed
    }
  }

  // Publish Post Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Post Object
    const post = {
      title,
      photo,
    }

    // Build Form Data
    const formData = new FormData()
    Object.keys(post).forEach((key) => formData.append(key, post[key]))

    try {
      // Call API by Slice (And Send an Error if Request Fails)
      await dispatch(publishPost(formData)).unwrap()

      // Hide New Post Form
      handleNewForm()

      // Clean New Post Form Fields
      setTitle('')
      setPhoto('')
    } catch (error) {
      // Do Nothing
    }

    // Reset All Post States (Message) after Timeout
    resetMessage()
  }

  // Show and Fill Update Post Form
  const handleEdit = (post) => {
    // Scroll Window to the Top
    window.scrollTo({ top: 'top', behavior: 'smooth' })

    // Show Edit Form
    if (editPostForm.current.classList.contains('hide')) {
      handleEditForm()
    }

    // Fill Form with Post Info
    setEditId(post._id)
    setEditTitle(post.title)
    setEditPhoto(post.photo)
  }

  // Update Post Handle Submit
  const handleUpdate = async (e) => {
    e.preventDefault()

    // Post Object
    const postData = {
      title: editTitle,
      id: editId,
    }

    try {
      // Call API by Slice (And Send an Error if Request Fails)
      await dispatch(updatePost(postData)).unwrap()

      // Hide Edit Post Form
      handleEditForm()
    } catch (error) {
      // Do Nothing
    }

    // Reset All Post States (Message) after Timeout
    resetMessage()
  }

  // Open Confirm Dialog
  const handleDelete = (id) => {
    setDeleteId(id)
    setShowConfirmBox(true)
  }

  // Confirm Delete Post Action (Delete Post Handle Submit)
  const confirmDelete = async () => {
    // Call API by Slice and Wait Before Moving Forward
    await dispatch(deletePost(deleteId)).unwrap()

    // Close Confirm Dialogue
    cancelDelete()

    // Reset All Post States (Message) after Timeout
    resetMessage()
  }

  // Cancel Delete Post Action
  const cancelDelete = () => {
    // Close Confirm Dialog
    setDeleteId('')
    setShowConfirmBox(false)
  }

  // Loading Element
  if (loadingUser) {
    return <SpinnerLoader />
  }

  return (
    <div id="profile">
      <div id="profile-info">
        {userProfile.profilePhoto ? (
          <RoundedImage
            className="profile-photo"
            src={`${uploads}/users/${userProfile.profilePhoto}`}
            alt={userProfile.name}
            width="small"
          />
        ) : (
          <RoundedImage
            className="profile-photo"
            src={`${noUserPhoto}`}
            alt={userProfile.name}
            width="small"
          />
        )}
        <div id="profile-description">
          <h2>{userProfile.name}</h2>
          <p>{userProfile.bio}</p>
        </div>
      </div>
      {userAuth && id === userAuth._id && (
        <>
          <div id="new-post-button" ref={newPostButton}>
            <h3>Share some moments of yours:</h3>
            <button onClick={handleNewForm}>New Post</button>
          </div>
          <div className="new-post hide" ref={newPostForm}>
            <h3>Share some moments of yours:</h3>
            {previewPhoto && (
              <img src={URL.createObjectURL(previewPhoto)} alt={editTitle} />
            )}
            <form onSubmit={handleSubmit}>
              <label>
                <span>Title</span>
                <input
                  type="text"
                  placeholder="Type a title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ''}
                />
              </label>
              <label>
                <span>Photo</span>
                <input type="file" ref={photoRef} onChange={handlePhotoFile} />
              </label>
              {errorPost && <Message msg={errorPost} type="error" />}
              {!loadingPost && <input type="submit" value="Post" />}
              {loadingPost && <input type="submit" value="Wait..." disabled />}
              <button
                type="button"
                className="cancel-btn"
                onClick={handleNewForm}
              >
                Cancel
              </button>
            </form>
          </div>
          <div className="edit-post hide" ref={editPostForm}>
            <h3>Edit your post:</h3>
            {editPhoto && (
              <img src={`${uploads}/posts/${editPhoto}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Type a title"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ''}
              />
              {errorPost && <Message msg={errorPost} type="error" />}
              {!loadingPost && <input type="submit" value="Update" />}
              {loadingPost && <input type="submit" value="Wait..." disabled />}
              <button
                type="button"
                className="cancel-btn"
                onClick={handleEditForm}
              >
                Cancel
              </button>
            </form>
          </div>

          {messagePost && <Message msg={messagePost} type="success" />}
          {showConfirmBox && (
            <ConfirmBox
              message="Are you sure you want to delete this post?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </>
      )}
      <div id="user-posts">
        <h2>Published Posts</h2>
        <div id="posts-container">
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <div className="post" key={post._id}>
                {post.photo && (
                  <img
                    src={`${uploads}/posts/${post.photo}`}
                    alt={post.title}
                  />
                )}
                {userAuth && id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/post/${post._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(post)} />
                    <BsXLg onClick={() => handleDelete(post._id)} />
                  </div>
                ) : (
                  <div className="actions">
                    <Link to={`/post/${post._id}`}>
                      <BsFillEyeFill />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          {posts.message && posts.message[0] !== null && (
            <p>There are no posts published yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
