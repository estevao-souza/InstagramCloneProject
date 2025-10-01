// CSS
import './PostDetails.css'

// Utils
import { uploads, noUserPhoto } from '../../utils/config'

// React Router Config
import { Link, useParams } from 'react-router-dom'

// Hooks
import { useState, useEffect } from 'react'
import { useScrollWindow } from '../../hooks/useScrollWindow'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails } from '../../slices/userSlice'
import {
  getPost,
  likeUnlikePost,
  commentPost,
  deleteCommentPost,
  reset,
} from '../../slices/postSlice'

// Components
import PostItem from '../../components/PostItem/PostItem'
import LikeContainer from '../../components/LikeContainer/LikeContainer'
import ConfirmBox from '../../components/ConfirmBox/ConfirmBox'
import SpinnerLoader from '../../components/SpinnerLoader/SpinnerLoader'

// React Icon
import { BsFillTrash3Fill } from 'react-icons/bs'

const Photo = () => {
  const { id } = useParams()
  const [deleteId, setDeleteId] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showConfirmBox, setShowConfirmBox] = useState(null)
  const [userDetailsFromComments, setUserDetailsFromComments] = useState({})
  const dispatch = useDispatch()
  const resetMessage = useResetComponentMessage(dispatch, reset)

  // Get Initial States from Store
  const { user } = useSelector((state) => state.auth)
  const { post, loading } = useSelector((state) => state.post)

  // Scroll Window to the Top when Open the Page
  useScrollWindow('top')

  // Load Post Data
  useEffect(() => {
    // Call API by Slice
    dispatch(getPost(id))
  }, [dispatch, id])

  // Load User Details from Comments
  useEffect(() => {
    const fetchUserDetailsFromComments = async () => {
      if (post.comments && post.comments.length > 0) {
        // Get User IDs from Comments
        const uniqueUserIds = [
          ...new Set(post.comments.map((comment) => comment.userId)),
        ]

        // Get Each User Details from Comments
        for (const userId of uniqueUserIds) {
          // Avoid Get the Same User Again if it's Already in the State
          if (!userDetailsFromComments[userId]) {
            // Call API by Slice
            const action = await dispatch(getUserDetails(userId))

            // Insert New User Details from Comment
            if (action.meta.requestStatus === 'fulfilled') {
              const usersData = action.payload
              setUserDetailsFromComments((prev) => ({
                ...prev,
                [userId]: usersData,
              }))
            }
          }
        }
      }
    }

    // Call Fetch User Details from Comments Function
    fetchUserDetailsFromComments()
  }, [post.comments, dispatch])

  // Handle Like and Unlike
  const handleLikeUnlike = (post) => {
    // Call API by Slice
    dispatch(likeUnlikePost(post._id))
  }

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault()

    // Check if Comment is not Empty
    if (commentText !== '') {
      // Comment Object
      const commentData = {
        comment: commentText,
        id: post._id,
      }

      // Call API by Slice and Wait Before Moving Forward
      dispatch(commentPost(commentData))

      // Reset Fields
      setCommentText('')
    }
  }

  // Open Confirm Dialog
  const handleDelete = (id) => {
    setDeleteId(id)
    setShowConfirmBox(true)
  }

  // Confirm Delete Comment Action (Delete Comment Handle Submit)
  const confirmDelete = async () => {
    // Call API by Slice and Wait Before Moving Forward
    await dispatch(
      deleteCommentPost({ postId: id, commentId: deleteId })
    ).unwrap()

    // Close Confirm Dialogue
    cancelDelete()

    // Reset All Post States (Message) after Timeout
    resetMessage()
  }

  // Cancel Comment Post Action
  const cancelDelete = () => {
    // Close Confirm Dialog
    setDeleteId('')
    setShowConfirmBox(false)
  }

  // Loading Element
  if (loading) {
    return <SpinnerLoader />
  }

  return (
    <div id="postDetails">
      <PostItem post={post} />
      <LikeContainer post={post} user={user} handleLike={handleLikeUnlike} />
      <div id="comments">
        {post.comments && (
          <div>
            <h3>{post.comments.length} comments</h3>
            <div id="comments-scrollable">
              {post.comments.length === 0 && <p>No comments...</p>}
              {post.comments.map((comment) => {
                // Get Current User Details from Comment
                const currentUserDetails =
                  userDetailsFromComments[comment.userId]

                return (
                  <div className="comment" key={comment._id}>
                    <div className="user-photo">
                      {currentUserDetails?.profilePhoto ? (
                        <img
                          src={`${uploads}/users/${currentUserDetails.profilePhoto}`}
                          alt={currentUserDetails?.name}
                        />
                      ) : (
                        <img
                          src={`${noUserPhoto}`}
                          alt={currentUserDetails?.name}
                        />
                      )}
                    </div>
                    <div className="comment-content">
                      <Link to={`/user/${comment.userId}`}>
                        <p>{currentUserDetails?.name}</p>
                      </Link>
                      <p>{comment.comment}</p>
                    </div>
                    <div className="actions">
                      {user._id === comment.userId && (
                        <BsFillTrash3Fill
                          onClick={() => handleDelete(comment._id)}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div id="comment-form">
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Type your comment"
                  onChange={(e) => setCommentText(e.target.value)}
                  value={commentText || ''}
                />
                <input type="submit" value="Send" />
              </form>
            </div>
          </div>
        )}
        {showConfirmBox && (
          <ConfirmBox
            message="Are you sure you want to delete this comment?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </div>
  )
}

export default Photo
