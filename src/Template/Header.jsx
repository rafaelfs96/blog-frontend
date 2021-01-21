import React, { useState, useContext, useReducer, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import Axios from 'axios'

import { DispatchContext, StateContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'
import { LOGIN_ACTIONS } from '../Reducers/LoginReducer/LoginActions'
import { loginInitialState, LoginReducer } from '../Reducers/LoginReducer/LoginReducer'

function Header({ staticEmpty }) {
  const { loggedIn, user, unreadChatCount } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [loginState, loginDispatch] = useReducer(LoginReducer, loginInitialState)

  useEffect(() => {
    if (loginState.submitCount) {
      const AxiosRequest = Axios.CancelToken.source()

      function login() {
        Axios.post(
          '/login',
          {
            username: loginState.username.value,
            password: loginState.password.value
          },
          { cancelToken: AxiosRequest.token }
        )
          .then(res => {
            if (res.data) {
              appDispatch({ type: APP_ACTIONS.login, value: res.data })
              appDispatch({
                type: APP_ACTIONS.flashMessage,
                value: 'You have successfully logged in',
                color: 'success'
              })
            } else
              appDispatch({
                type: APP_ACTIONS.flashMessage,
                value: 'incorrect username / password',
                color: 'warning'
              })
          })
          .catch(error =>
            appDispatch({
              type: APP_ACTIONS.flashMessage,
              value: 'There was an error with this request',
              color: 'danger'
            })
          )
      }

      login()

      return () => AxiosRequest.cancel()
    }
  }, [loginState.submitCount])

  const handleSubmit = event => {
    event.preventDefault()

    loginDispatch({ type: LOGIN_ACTIONS.usernameImmediately, value: loginState.username.value })
    loginDispatch({ type: LOGIN_ACTIONS.passwordImmediately, value: loginState.password.value })
    loginDispatch({ type: LOGIN_ACTIONS.submitForm })
  }

  const handleLogout = () => {
    appDispatch({ type: APP_ACTIONS.logout })
    appDispatch({
      type: APP_ACTIONS.flashMessage,
      value: 'You have successfully logged out',
      color: 'warning'
    })
  }

  const handleSearchIcon = evt => {
    evt.preventDefault()
    appDispatch({ type: APP_ACTIONS.openSearch })
  }

  return (
    <header className='header-bar bg-primary mb-3'>
      <div className='container d-flex flex-column flex-md-row align-items-center p-3'>
        <h4 className='my-0 mr-md-auto font-weight-normal'>
          <Link to='/' className='text-white'>
            ComplexApp
          </Link>
        </h4>
        {staticEmpty ? (
          ''
        ) : loggedIn ? (
          <div className='flex-row my-3 my-md-0'>
            <button onClick={handleSearchIcon} className='text-white mr-2 header-search-icon' data-for='search' data-tip='Search'>
              <i className='fas fa-search'></i>
            </button>
            <ReactTooltip place='bottom' id='search' class='custom-tooltip' />{' '}
            <button onClick={() => appDispatch({ type: APP_ACTIONS.toogleChat })} className={`mr-2 header-chat-icon ${unreadChatCount ? 'text-danger' : 'text-white'}`} data-for='chat' data-tip='Chat'>
              <i className='fas fa-comment'></i>
              {unreadChatCount ? <span className='chat-count-badge text-white'>{unreadChatCount < 10 ? unreadChatCount : '9+'}</span> : ''}
            </button>
            <ReactTooltip place='bottom' id='chat' class='custom-tooltip' />{' '}
            <Link to={`/profile/${user.username}`} className='mr-2' data-for='profile' data-tip='My Profile'>
              <img className='small-header-avatar' title={`${user.username}'s avatar`} alt={`${user.username}'s avatar`} src={user.avatar} />
            </Link>
            <ReactTooltip place='bottom' id='profile' class='custom-tooltip' />{' '}
            <Link className='btn btn-sm btn-success mr-2' to='/create-post'>
              Create Post
            </Link>{' '}
            <button onClick={handleLogout} className='btn btn-sm btn-secondary'>
              Sign Out
            </button>
          </div>
        ) : (
          <form className='mb-0 pt-2 pt-md-0' onSubmit={handleSubmit}>
            <div className='row align-items-center'>
              <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
                <input onChange={evt => loginDispatch({ type: LOGIN_ACTIONS.usernameImmediately, value: evt.target.value })} name='username' className={`${loginState.username.hasErrors ? 'is-invalid' : ''} form-control form-control-sm input-dark`} type='text' placeholder='Username' autoComplete='off' />
              </div>
              <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
                <input onChange={evt => loginDispatch({ type: LOGIN_ACTIONS.passwordImmediately, value: evt.target.value })} name='password' className={`${loginState.password.hasErrors ? 'is-invalid' : ''} form-control form-control-sm input-dark`} type='password' placeholder='Password' />
              </div>
              <div className='col-md-auto'>
                <button className='btn btn-success btn-sm'>Sign In</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </header>
  )
}

export default Header
