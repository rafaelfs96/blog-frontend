import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import Axios from 'axios'

import { DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import Loading from '../Components/Loading'

function ProfileFollows({ type }) {
  const [{ isLoading, follows }, setState] = useState({ isLoading: true, follows: [] })

  const { username } = useParams()
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }))
    const AxiosRequest = Axios.CancelToken.source()

    Axios.get(`/profile/${username}/${type}`, { cancelToken: AxiosRequest.token })
      .then(res => setState(prev => ({ ...prev, isLoading: false, follows: res.data })))
      .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' }))

    return () => AxiosRequest.cancel()
  }, [username])

  if (isLoading) return <Loading />

  return (
    <ul className='list-group'>
      {follows.length ? (
        follows.map((follow, index) => {
          return (
            <li key={index}>
              <Link to={`/profile/${follow.username}`} className='list-group-item list-group-item-action'>
                <img className='avatar-tiny' alt={follow.username} title={follow.username} src={follow.avatar} /> {follow.username}
              </Link>
            </li>
          )
        })
      ) : (
        <li>
          <p>No data found</p>
        </li>
      )}
    </ul>
  )
}

export default ProfileFollows
