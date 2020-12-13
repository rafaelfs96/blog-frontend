import React, { useContext, useState, useEffect, useReducer } from 'react'
import { CSSTransition } from 'react-transition-group'

import Axios from 'axios'

import { StateContext, DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'
import { SIGNUP_ACTION } from '../Reducers/SignupReducer/SignupActions'
import { SignupReducer, signupInitialState } from '../Reducers/SignupReducer/SignupReducer'

import Page from '../Layout/Page'
import Loading from '../Components/Loading'
import PostItem from '../Components/PostItem'

function Home() {
  const [{ feed, isLoading }, setState] = useState({ isLoading: true, feed: [] })

  const { user: contextUser, loggedIn: contextLoggedIn } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [signupState, signupDispatch] = useReducer(SignupReducer, signupInitialState)

  useEffect(() => {
    if (signupState.username.value) {
      const delay = setTimeout(() => signupDispatch({ type: SIGNUP_ACTION.usernameAfterDelay }), 800)

      return () => clearTimeout(delay)
    }
  }, [signupState.username.value])

  useEffect(() => {
    if (signupState.email.value) {
      const delay = setTimeout(() => signupDispatch({ type: SIGNUP_ACTION.emailAfterDelay }), 800)

      return () => clearTimeout(delay)
    }
  }, [signupState.email.value])

  useEffect(() => {
    if (signupState.password.value) {
      const delay = setTimeout(() => signupDispatch({ type: SIGNUP_ACTION.passwordAfterDelay }), 800)

      return () => clearTimeout(delay)
    }
  }, [signupState.password.value])

  useEffect(() => {
    if (signupState.username.checkCount) {
      const AxiosRequest = Axios.CancelToken.source()

      Axios.post('/doesUsernameExist', { username: signupState.username.value }, { cancelToken: AxiosRequest.token })
        .then(res => {
          signupDispatch({
            type: SIGNUP_ACTION.usernameUniqueResults,
            value: res.data
          })
        })
        .catch(error => {
          appDispatch({
            type: APP_ACTIONS.flashMessage,
            value: 'There was a problem or the request was cancelled'
          })
        })

      return () => AxiosRequest.cancel()
    }
  }, [signupState.username.checkCount])

  useEffect(() => {
    if (signupState.email.checkCount) {
      const AxiosRequest = Axios.CancelToken.source()
      function fetchResults() {
        Axios.post('/doesEmailExist', { email: signupState.email.value }, { cancelToken: AxiosRequest.token })
          .then(res => {
            signupDispatch({
              type: SIGNUP_ACTION.emailUniqueResults,
              value: res.data
            })
          })
          .catch(error => {
            appDispatch({
              type: APP_ACTIONS.flashMessage,
              value: 'There was a problem or the request was cancelled'
            })
          })
      }

      fetchResults()

      return () => AxiosRequest.cancel()
    }
  }, [signupState.email.checkCount])

  useEffect(() => {
    if (signupState.submitCount) {
      const AxiosRequest = Axios.CancelToken.source()
      function fetchResults() {
        Axios.post(
          '/register',
          {
            username: signupState.username.value,
            email: signupState.email.value,
            password: signupState.password.value
          },
          { cancelToken: AxiosRequest.token }
        )
          .then(res => {
            appDispatch({ type: APP_ACTIONS.login, value: res.data })

            appDispatch({
              type: APP_ACTIONS.flashMessage,
              value: 'Congrats, welcome to your new account!'
            })
          })
          .catch(error => {
            appDispatch({
              type: APP_ACTIONS.flashMessage,
              value: 'There was a problem or the request was cancelled'
            })
          })
      }

      fetchResults()

      return () => AxiosRequest.cancel()
    }
  }, [signupState.submitCount])

  useEffect(() => {
    if (contextLoggedIn) {
      const AxiosRequest = Axios.CancelToken.source()
      function fetchData() {
        Axios.post('/getHomeFeed', { token: contextUser.token }, { cancelToken: AxiosRequest.token })
          .then(res => {
            setState(prev => ({
              ...prev,
              isLoading: false,
              feed: res.data
            }))
          })
          .catch(error => {
            appDispatch({
              type: APP_ACTIONS.flashMessage,
              value: 'There was an error with this request or the request was cancelled'
            })
          })
      }

      fetchData()

      return () => AxiosRequest.cancel()
    }
  }, [contextLoggedIn])

  const handleSubmit = event => {
    event.preventDefault()

    signupDispatch({ type: SIGNUP_ACTION.usernameImmediately, value: signupState.username.value })
    signupDispatch({ type: SIGNUP_ACTION.usernameAfterDelay, value: signupState.username.value, noRequest: true })

    signupDispatch({ type: SIGNUP_ACTION.emailImmediately, value: signupState.email.value })
    signupDispatch({ type: SIGNUP_ACTION.emailAfterDelay, value: signupState.email.value, noRequest: true })

    signupDispatch({ type: SIGNUP_ACTION.passwordImmediately, value: signupState.password.value })
    signupDispatch({ type: SIGNUP_ACTION.passwordAfterDelay, value: signupState.password.value })

    signupDispatch({ type: SIGNUP_ACTION.submitForm })
  }

  if (contextLoggedIn && isLoading) return <Loading />

  return contextLoggedIn ? (
    <Page title='Your Home'>
      {feed.length ? (
        <React.Fragment>
          <h2 className='text-center mb-4'>The Latest from those you follow</h2>
          <ul className='list-group'>
            {feed.map(post => {
              return <PostItem post={post} key={post._id} />
            })}
          </ul>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h2 className='text-center'>
            Hello <strong>{contextUser.username}</strong>, your feed is empty.
          </h2>
          <p className='lead text-muted text-center'>Your feed displays the latest posts from the people you follow. If you don't have any friends to follow that's okay; you can use the 'Search' feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </React.Fragment>
      )}
    </Page>
  ) : (
    <Page title='Welcome' wide={true}>
      <div className='row align-items-center'>
        <div className='col-lg-7 py-3 py-md-5'>
          <h1 className='display-3'>Remember Writing?</h1>
          <p className='lead text-muted'>Are you sick of short tweets and impersonal 'shared' posts that are reminiscent of the late 90's email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className='col-lg-5 pl-lg-5 pb-3 py-lg-5'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username-register' className='text-muted mb-1'>
                <small>Username</small>
              </label>
              <input onChange={evt => signupDispatch({ type: SIGNUP_ACTION.usernameImmediately, value: evt.target.value })} id='username-register' name='username' className='form-control' type='text' placeholder='Pick a username' autoComplete='off' />
              <CSSTransition in={signupState.username.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
                <div className='alert alert-danger small liveValidateMessage'>{signupState.username.message}</div>
              </CSSTransition>
            </div>
            <div className='form-group'>
              <label htmlFor='email-register' className='text-muted mb-1'>
                <small>Email</small>
              </label>
              <input onChange={evt => signupDispatch({ type: SIGNUP_ACTION.emailImmediately, value: evt.target.value })} id='email-register' name='email' className='form-control' type='text' placeholder='you@example.com' autoComplete='off' />
              <CSSTransition in={signupState.email.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
                <div className='alert alert-danger small liveValidateMessage'>{signupState.email.message}</div>
              </CSSTransition>
            </div>
            <div className='form-group'>
              <label htmlFor='password-register' className='text-muted mb-1'>
                <small>Password</small>
              </label>
              <input onChange={evt => signupDispatch({ type: SIGNUP_ACTION.passwordImmediately, value: evt.target.value })} id='password-register' name='password' className='form-control' type='password' placeholder='Create a password' />
              <CSSTransition in={signupState.password.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
                <div className='alert alert-danger small liveValidateMessage'>{signupState.password.message}</div>
              </CSSTransition>
            </div>
            <button type='submit' className='py-3 mt-4 btn btn-lg btn-success btn-block'>
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default Home
