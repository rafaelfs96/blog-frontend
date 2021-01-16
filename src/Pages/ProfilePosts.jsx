import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Axios from 'axios'

import { DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import Loading from '../Components/Loading'
import PostItem from '../Components/PostItem'

function ProfilePosts() {
  const [{ isLoading, posts, profileStatus }, setState] = useState({ isLoading: true, posts: [], profileStatus: 'loading' })

  const { username } = useParams()
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }))
    const AxiosRequest = Axios.CancelToken.source()

    Axios.get(`/profile/${username}/posts`, { cancelToken: AxiosRequest.token })
      .then(res => {
        if (res.data) {
          setState(prev => ({ ...prev, isLoading: false, posts: res.data, profileStatus: 'found' }))
        } else {
          throw new Error('profile not found')
        }
      })
      .catch(error => {
        setState(prev => ({ ...prev, profileStatus: 'not found' }))
        if (error.toString() !== 'Error: profile not found') {
          appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' })
        }
      })

    return () => AxiosRequest.cancel()
  }, [username])

  if (isLoading) return <Loading />
  if (profileStatus === 'not found') return

  return (
    <ul className='list-group'>
      {posts.map(post => (
        <PostItem noAuthor={true} post={post} key={post._id} />
      ))}
    </ul>
  )
}

export default ProfilePosts
