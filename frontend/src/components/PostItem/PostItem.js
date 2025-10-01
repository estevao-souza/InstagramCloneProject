// CSS
import './PostItem.css'

// Utils
import { uploads } from '../../utils/config'

// React Router Config
import { Link } from 'react-router-dom'

const PostItem = ({ post }) => {
  return (
    <div className="post-item">
      {post.photo && (
        <img src={`${uploads}/posts/${post.photo}`} alt={post.title} />
      )}
      <h2>{post.title}</h2>
      <p className="post-author">
        Published by: <Link to={`/user/${post.userId}`}>{post.userName}</Link>
      </p>
    </div>
  )
}

export default PostItem
