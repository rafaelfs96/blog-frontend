import React, { useEffect, useContext, useReducer } from 'react'
import { useParams, Link, withRouter } from 'react-router-dom'

import Axios from 'axios'

import { DispatchContext, StateContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'
import { EDIT_POST_ACTIONS } from '../Reducers/PostReducer/EditPostActions'
import { EDIT_POST_INITIAL_STATE, editPostReducer } from '../Reducers/PostReducer/EditPostReducer'

import Page from '../Layout/Page'
import Loading from '../Components/Loading'
import NotFound from './NotFound'

function EditPost({ history }) {
  const initialState = EDIT_POST_INITIAL_STATE(useParams().id)

  const [postState, editPostDispatch] = useReducer(editPostReducer, initialState)

  const appDispatch = useContext(DispatchContext)
  const { user } = useContext(StateContext)

  const submitHandler = evt => {
    evt.preventDefault()
    editPostDispatch({ type: EDIT_POST_ACTIONS.titleRules, value: postState.title.value })
    editPostDispatch({ type: EDIT_POST_ACTIONS.bodyRules, value: postState.body.value })
    editPostDispatch({ type: EDIT_POST_ACTIONS.submitRequest })
  }

  useEffect(() => {
    const AxiosRequest = Axios.CancelToken.source()

    Axios.get(`/post/${postState.id}`, { cancelToken: AxiosRequest.token })
      .then(res => {
        if (res.data) {
          editPostDispatch({ type: EDIT_POST_ACTIONS.fetchComplete, value: res.data })
          if (user.username !== res.data.author.username) {
            appDispatch({ type: APP_ACTIONS.flashMessage, value: 'You do not have permission to edit this post', color: 'danger' })

            history.push('/')
          }
        } else editPostDispatch({ type: EDIT_POST_ACTIONS.notFound })
      })
      .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was an error with this request or the request was cancelled', color: 'warning' }))

    return () => AxiosRequest.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (postState.sendCount) {
      editPostDispatch({ type: EDIT_POST_ACTIONS.saveRequestStarted })
      const AxiosRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          await Axios.post(
            `/post/${postState.id}/edit`,
            {
              title: postState.title.value,
              body: postState.body.value,
              token: user.token
            },
            { cancelToken: AxiosRequest.token }
          )
          appDispatch({ type: APP_ACTIONS.flashMessage, value: 'Post was saved!', color: 'success' })
        } catch (error) {
          appDispatch({
            type: APP_ACTIONS.flashMessage,
            value: 'There was an error with this request or the request was cancelled',
            color: 'warning'
          })
        } finally {
          editPostDispatch({ type: EDIT_POST_ACTIONS.saveRequestFinished })
        }
      }

      fetchPost()

      return () => AxiosRequest.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postState.sendCount])

  if (postState.notFound) return <NotFound />

  if (postState.isFetching) {
    return (
      <Page title='...'>
        <Loading />
      </Page>
    )
  }

  return (
    <Page title='Edit Post'>
      <Link className='small font-weight-bold' to={`/post/${postState.id}`}>
        {'<< Back to post permalink'}
      </Link>
      <form className='mt-3' onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input onBlur={evt => editPostDispatch({ type: EDIT_POST_ACTIONS.titleRules, value: evt.target.value })} onChange={evt => editPostDispatch({ type: EDIT_POST_ACTIONS.titleChange, value: evt.target.value })} value={postState.title.value} autoFocus name='title' id='post-title' className='form-control form-control-lg form-control-title' type='text' placeholder='' autoComplete='off' />
          {postState.title.hasErrors && <div className='alert alert-danger small liveValidateMessage'>{postState.title.message}</div>}
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea onBlur={evt => editPostDispatch({ type: EDIT_POST_ACTIONS.bodyRules, value: evt.target.value })} onChange={evt => editPostDispatch({ type: EDIT_POST_ACTIONS.bodyChange, value: evt.target.value })} value={postState.body.value} name='body' id='post-body' className='body-content tall-textarea form-control' type='text' />
          {postState.body.hasErrors && <div className='alert alert-danger small liveValidateMessage'>{postState.body.message}</div>}
        </div>

        <button className='btn btn-primary' disabled={postState.isSaving || postState.body.hasErrors || postState.title.hasErrors}>
          {postState.isSaving ? 'Saving...' : 'Save Updates'}
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
