import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, withRouter } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import Axios from 'axios'

import { DispatchContext, StateContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import Page from '../Layout/Page'
import Loading from '../Components/Loading'
import NotFound from './NotFound'

function SinglePost({ history }) {
  const [{ isLoading, post }, setState] = useState({
    isLoading: true,
    post: {}
  })

  const { id } = useParams()

  const appDispatch = useContext(DispatchContext)
  const { loggedIn, user } = useContext(StateContext)

  useEffect(() => {
    const AxiosRequest = Axios.CancelToken.source()

    Axios.get(`/post/${id}/`, { cancelToken: AxiosRequest.token })
      .then(res => setState(prev => ({ ...prev, post: res.data, isLoading: false })))
      .catch(error =>
        appDispatch({
          type: APP_ACTIONS.flashMessage,
          value: 'There was an error with this request or the request was cancelled',
          color: 'warning'
        })
      )

    return () => AxiosRequest.cancel()
  }, [id])

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  const isOwner = () => (loggedIn ? user.username === post.author.username : false)

  const deleteHandler = () => {
    const areYouSure = window.confirm('Do you really want to delete this post')
    if (areYouSure) {
      Axios.delete(`/post/${id}`, { data: { token: user.token } })
        .then(res => {
          if (res.data === 'Success') {
            appDispatch({ type: APP_ACTIONS.flashMessage, value: 'Post was deleted', color: 'success' })

            history.push(`/profile/${user.username}`)
          }
        })
        .catch(error =>
          appDispatch({
            type: APP_ACTIONS.flashMessage,
            value: 'There was an error deleting this post',
            color: 'warning'
          })
        )
    }
  }

  if (!isLoading && !post) return <NotFound />

  if (isLoading) {
    return (
      <Page title='...'>
        <Loading />
      </Page>
    )
  }

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/post/${id}/edit`} data-tip='Edit' data-for='edit' className='text-primary mr-2'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactTooltip id='edit' className='custom-tooltip' />{' '}
            <a onClick={deleteHandler} data-tip='Delete' data-for='delete' className='delete-post-button text-danger' title='Delete'>
              <i className='fas fa-trash'></i>
            </a>
            <ReactTooltip id='delete' className='custom-tooltip' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' alt={post.author.username} title={post.author.username} src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className='body-content'>
        <ReactMarkdown plugins={[gfm]} children={post.body} allowedTypes={['paragraph', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem']} />
      </div>
    </Page>
  )
}

export default withRouter(SinglePost)
