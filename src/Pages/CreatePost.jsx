import React, { useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'

import Axios from 'axios'

import { DispatchContext, StateContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import Page from '../Layout/Page'

function CreatePost({ history }) {
  const [{ body, title }, setState] = useState({ title: '', body: '' })

  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleSubmit = evt => {
    evt.preventDefault()

    Axios.post('/create-post', { title, body, token: user.token })
      .then(res => {
        appDispatch({
          type: APP_ACTIONS.flashMessage,
          value: 'Congrats, post created!',
          color: 'success'
        })
        history.push(`/post/${res.data}`)
      })
      .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error creating this post!', color: 'danger' }))
  }

  return (
    <Page title='Create Post'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input onChange={evt => setState(prev => ({ ...prev, title: evt.target.value }))} autoFocus name='title' id='post-title' className='form-control form-control-lg form-control-title' type='text' placeholder='' autoComplete='off' />
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea onChange={evt => setState(prev => ({ ...prev, title: evt.target.value }))} name='body' id='post-body' className='body-content tall-textarea form-control' type='text'></textarea>
        </div>

        <button className='btn btn-primary'>Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(CreatePost)
