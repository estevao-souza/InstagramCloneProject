// CSS
import './Home.css'

// React Router Config
import { Link } from 'react-router-dom'

// Hooks
import { useEffect } from 'react'
import { useScrollWindow } from '../../hooks/useScrollWindow'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { getAllPosts, likeUnlikePost } from '../../slices/postSlice'

// Components
import PostItem from '../../components/PostItem/PostItem'
import LikeContainer from '../../components/LikeContainer/LikeContainer'
import SpinnerLoader from '../../components/SpinnerLoader/SpinnerLoader'

const Home = () => {
  const dispatch = useDispatch()

  // Get Initial States from Store
  const { user } = useSelector((state) => state.auth)
  const { posts, loading } = useSelector((state) => state.post)

  // Scroll Window to the Top when Open the Page
  useScrollWindow('top')

  // Load All Posts
  useEffect(() => {
    // Call API by Slice
    dispatch(getAllPosts())
  }, [dispatch])

  // Handle Like
  const handleLikeUnlike = (post) => {
    // Call API by Slice
    dispatch(likeUnlikePost(post._id))
  }

  // Loading Element
  if (loading) {
    return <SpinnerLoader />
  }

  return (
    <div id="home">
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <div key={post._id}>
            <PostItem post={post} />
            <div className="postRow">
              <LikeContainer
                post={post}
                user={user}
                handleLike={handleLikeUnlike}
              />
              <Link className="btn" to={`/post/${post._id}`}>
                See more
              </Link>
            </div>
          </div>
        ))}
      {posts.message && posts.message[0] !== null && (
        <h2 className="no-posts">
          No posts published.
          <div>
            {user && <Link to={`/user/${user._id}`}>Publish New Post</Link>}
          </div>
        </h2>
      )}
    </div>
  )
}

export default Home
