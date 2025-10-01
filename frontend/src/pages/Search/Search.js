// CSS
import './Search.css'

// React Router Config
import { Link } from 'react-router-dom'

// Hooks
import { useEffect } from 'react'
import { useQuery } from '../../hooks/useQuery'
import { useScrollWindow } from '../../hooks/useScrollWindow'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { searchPosts, likeUnlikePost } from '../../slices/postSlice'

// Component
import PostItem from '../../components/PostItem/PostItem'
import LikeContainer from '../../components/LikeContainer/LikeContainer'
import SpinnerLoader from '../../components/SpinnerLoader/SpinnerLoader'

const Search = () => {
  const dispatch = useDispatch()
  const query = useQuery()
  const search = query.get('q')

  // Get Initial States from Store
  const { user } = useSelector((state) => state.auth)
  const { posts, loading } = useSelector((state) => state.post)

  // Scroll Window to the Top when Open the Page
  useScrollWindow('top')

  // Load All Posts
  useEffect(() => {
    // Call API by Slice
    dispatch(searchPosts(search))
  }, [dispatch, search])

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
    <div id="search">
      {posts && posts.length > 0 && (
        <h2>
          Search results for <span id="search-term">"{search}"</span>
        </h2>
      )}

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

      {posts && posts.length === 0 && (
        <h2 className="no-posts">
          No results found for <span id="search-term">"{search}"</span>
        </h2>
      )}
    </div>
  )
}

export default Search
