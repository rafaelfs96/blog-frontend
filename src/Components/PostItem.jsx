import React from 'react'
import { Link } from 'react-router-dom'

function PostItem({ post, onClick, noAuthor }) {
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (
    <li onClick={onClick}>
      <Link to={`/post/${post._id}`} className='list-group-item list-group-item-action'>
        <img className='avatar-tiny' alt={post.author.username} title={post.author.username} src={post.author.avatar} /> <strong>{post.title}</strong>{' '}
        <span className='text-muted small'>
          {!noAuthor && `by ${post.author.username}`} on {dateFormatted}
        </span>
      </Link>
    </li>
  )
}

export default PostItem
