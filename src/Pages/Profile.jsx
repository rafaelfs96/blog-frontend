import React, { useEffect, useContext, useState } from 'react'
import { useParams, NavLink, Switch, Route } from 'react-router-dom'

import Axios from 'axios'

import { StateContext, DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'
import Page from '../Layout/Page'
import ProfilePosts from './ProfilePosts'
import ProfileFollows from './ProfileFollows'
import NotFound from './NotFound'

function Profile() {
  const initialState = {
    profileStatus: 'loading',
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: { postCount: '', followerCount: '', followingCount: '' }
    }
  }

  const [{ followActionLoading, profileData, startFollowingRequestCount, stopFollowingRequestCount, profileStatus }, setState] = useState(initialState)

  const { username } = useParams()

  const { user, loggedIn } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    setState(initialState)
    const AxiosRequest = Axios.CancelToken.source()

    function fetchData() {
      Axios.post(`/profile/${username}`, { token: user.token }, { cancelToken: AxiosRequest.token })
        .then(res => {
          if (res.data) {
            setState(prev => ({ ...prev, profileData: res.data, profileStatus: 'found' }))
          } else throw new Error('profile not found')
        })
        .catch(error => {
          setState(prev => ({ ...prev, profileStatus: 'not found' }))
          if (error.toString() !== 'Error: profile not found') {
            appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' })
          }
        })

      setState(prev => ({ ...prev, isLoading: false }))
    }

    fetchData()

    return () => AxiosRequest.cancel()
  }, [username])

  useEffect(() => {
    if (startFollowingRequestCount) {
      setState(prev => ({ ...prev, followActionLoading: true }))
      const AxiosRequest = Axios.CancelToken.source()

      function fetchData() {
        Axios.post(`/addFollow/${profileData.profileUsername}`, { token: user.token }, { cancelToken: AxiosRequest.token })
          .then(res => {
            setState(prev => ({
              ...prev,
              profileData: {
                ...prev.profileData,
                isFollowing: true,
                counts: {
                  ...prev.profileData.counts,
                  followerCount: prev.profileData.counts.followerCount + 1
                }
              },
              followActionLoading: false
            }))
          })
          .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' }))
      }

      fetchData()

      return () => AxiosRequest.cancel()
    }
  }, [startFollowingRequestCount])

  useEffect(() => {
    if (stopFollowingRequestCount) {
      setState(prev => ({ ...prev, followActionLoading: true }))
      const AxiosRequest = Axios.CancelToken.source()

      Axios.post(`/removeFollow/${profileData.profileUsername}`, { token: user.token }, { cancelToken: AxiosRequest.token })
        .then(res => {
          setState(prev => ({
            ...prev,
            profileData: {
              ...prev.profileData,
              isFollowing: false,
              counts: {
                ...prev.profileData.counts,
                followerCount: prev.profileData.counts.followerCount - 1
              }
            },
            followActionLoading: false
          }))
        })
        .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled' }))

      return () => AxiosRequest.cancel()
    }
  }, [stopFollowingRequestCount])

  const startFollowing = () => setState(prev => ({ ...prev, startFollowingRequestCount: prev.startFollowingRequestCount + 1 }))
  const stopFollowing = () => setState(prev => ({ ...prev, stopFollowingRequestCount: prev.stopFollowingRequestCount + 1 }))

  return (
    <Page title={`${profileData.profileUsername}'s Profile`}>
      {['loading', 'found'].includes(profileStatus) ? (
        <>
          <h2>
            <img className='avatar-small' src={profileData.profileAvatar} alt={profileData.profileUsername} title={profileData.profileUsername} /> {profileData.profileUsername}
            {loggedIn && !profileData.isFollowing && user.username !== profileData.profileUsername && profileData.profileUsername !== '...' && (
              <button onClick={startFollowing} disabled={followActionLoading} className='btn btn-primary btn-sm ml-2'>
                Follow <i className='fas fa-user-plus'></i>
              </button>
            )}
            {loggedIn && profileData.isFollowing && user.username !== profileData.profileUsername && profileData.profileUsername !== '...' && (
              <button onClick={stopFollowing} disabled={followActionLoading} className='btn btn-danger btn-sm ml-2'>
                Stop Following <i className='fas fa-user-times'></i>
              </button>
            )}
          </h2>

          <div className='profile-nav nav nav-tabs pt-2 mb-4'>
            <NavLink exact to={`/profile/${profileData.profileUsername}`} className='nav-item nav-link'>
              Posts: {profileData.counts.postCount}
            </NavLink>
            <NavLink to={`/profile/${profileData.profileUsername}/followers`} className='nav-item nav-link'>
              Followers: {profileData.counts.followerCount}
            </NavLink>
            <NavLink to={`/profile/${profileData.profileUsername}/following`} className='nav-item nav-link'>
              Following: {profileData.counts.followingCount}
            </NavLink>
          </div>

          <Switch>
            <Route exact path='/profile/:username' component={ProfilePosts} />
            <Route path='/profile/:username/followers' component={() => <ProfileFollows type='followers' />} />
            <Route path='/profile/:username/following' component={() => <ProfileFollows type='following' />} />
          </Switch>
        </>
      ) : (
        <NotFound />
      )}
    </Page>
  )
}

export default Profile
