import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Axios from 'axios'

import { DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import Loading from '../Components/Loading'
import PostItem from '../Components/PostItem'

function ProfilePosts() {
  const [{ isLoading, posts }, setState] = useState({ isLoading: true, posts: [] })

  const { username } = useParams()
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }))
    const AxiosRequest = Axios.CancelToken.source()

    Axios.get(`/profile/${username}/posts`, { cancelToken: AxiosRequest.token })
      .then(res => setState(prev => ({ ...prev, isLoading: false, posts: res.data })))
      .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' }))

    return () => AxiosRequest.cancel()
  }, [username])

  if (isLoading) return <Loading />

  return (
    <ul className='list-group'>
      {posts.map(post => (
        <PostItem noAuthor={true} post={post} key={post._id} />
      ))}
    </ul>
  )
}

export default ProfilePosts
