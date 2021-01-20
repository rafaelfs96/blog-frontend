import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import Axios from 'axios'

import { DispatchContext, StateContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

function Header({ staticEmpty }) {
  const [{ password, username }, setState] = useState({ username: '', password: '' })

  const { loggedIn, user, unreadChatCount } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleLogin = evt => {
    evt.preventDefault()

    if (!username || !password) {
      appDispatch({
        type: APP_ACTIONS.flashMessage,
        value: 'You must provide an username and a password to login',
        color: 'warning'
      })
    } else {
      Axios.post('/login', { username, password })
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
          <form className='mb-0 pt-2 pt-md-0' onSubmit={handleLogin}>
            <div className='row align-items-center'>
              <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
                <input onChange={evt => setState(prev => ({ ...prev, username: evt.target.value }))} name='username' className='form-control form-control-sm input-dark' type='text' placeholder='Username' autoComplete='off' />
              </div>
              <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
                <input onChange={evt => setState(prev => ({ ...prev, password: evt.target.value }))} name='password' className='form-control form-control-sm input-dark' type='password' placeholder='Password' />
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
