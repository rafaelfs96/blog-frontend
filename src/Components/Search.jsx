import React, { useContext, useEffect, useState } from 'react'

import Axios from 'axios'

import { DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

import PostItem from './PostItem'

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [{ requestCount, results, searchTerm, show }, setState] = useState({
    searchTerm: '',
    results: [],
    show: 'neither',
    requestCount: 0
  })

  useEffect(() => {
    const searchKeyPressHandler = evt => {
      evt.keyCode === 27 && appDispatch({ type: APP_ACTIONS.closeSearch })
    }

    document.addEventListener('keyup', searchKeyPressHandler)
    return () => document.removeEventListener('keyup', searchKeyPressHandler)
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      setState(prev => ({ ...prev, show: 'loading' }))

      const delay = setTimeout(() => {
        setState(prev => ({ ...prev, requestCount: prev.requestCount + 1 }))
      }, 700)

      return () => clearTimeout(delay)
    } else {
      setState(prev => ({ ...prev, show: 'neither' }))
    }
  }, [searchTerm])

  useEffect(() => {
    if (requestCount) {
      const AxiosRequest = Axios.CancelToken.source()

      Axios.post('/search', { searchTerm }, { cancelToken: AxiosRequest.token })
        .then(res => setState(prev => ({ ...prev, results: res.data, show: 'results' })))
        .catch(error => appDispatch({ type: APP_ACTIONS.flashMessage, value: 'There was a problem or the request was cancelled' }))

      return () => AxiosRequest.cancel()
    }
  }, [requestCount])

  return (
    <React.Fragment>
      <div className='search-overlay-top shadow-sm'>
        <div className='container container--narrow'>
          <label htmlFor='live-search-field' className='search-overlay-icon'>
            <i className='fas fa-search'></i>
          </label>
          <input onChange={evt => setState(prev => ({ ...prev, searchTerm: evt.target.value }))} autoFocus type='text' autoComplete='off' id='live-search-field' className='live-search-field' placeholder='What are you interested in?' />
          <span onClick={() => appDispatch({ type: APP_ACTIONS.closeSearch })} className='close-live-search'>
            <i className='fas fa-times-circle'></i>
          </span>
        </div>
      </div>

      <div className='search-overlay-bottom'>
        <div className='container container--narrow py-3'>
          <div className={`circle-loader ${show === 'loading' ? 'circle-loader--visible' : ''}`}></div>
          <div className={`live-search-results ${show === 'results' ? 'live-search-results--visible' : ''}`}>
            {Boolean(results.length) && (
              <div className='list-group shadow-sm'>
                <div className='list-group-item active'>
                  <strong>Search Results</strong> ({results.length} {results.length > 1 ? 'items' : 'item'} found)
                </div>
                <ul>
                  {results.map(post => (
                    <PostItem post={post} key={post._id} onClick={() => appDispatch({ type: APP_ACTIONS.closeSearch })} />
                  ))}
                </ul>
              </div>
            )}
            {!Boolean(results.length) && <p className='alert alert-danger text-center shadow-sm'> Sorry, there was no results for that search</p>}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Search
