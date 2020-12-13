import React, { useEffect, useReducer, lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import Axios from 'axios'

import { DispatchContext, StateContext } from './Contexts/AppContext'
import { AppReducer, initialState } from './Reducers/AppReducer/AppReducer'

import Header from './Template/Header'
import Footer from './Template/Footer'
import About from './Pages/About'
import Terms from './Pages/Terms'
import NotFound from './Pages/NotFound'
import Home from './Pages/Home'

import FlashMessages from './Components/FlashMessages'
import { APP_ACTIONS } from './Reducers/AppReducer/AppActions'
import Loading from './Components/Loading'

const Chat = lazy(() => import('./Components/Chat'))
const Search = lazy(() => import('./Components/Search'))
const CreatePost = lazy(() => import('./Pages/CreatePost'))
const SinglePost = lazy(() => import('./Pages/SinglePost'))
const EditPost = lazy(() => import('./Pages/EditPost'))
const Profile = lazy(() => import('./Pages/Profile'))

Axios.defaults.baseURL = process.env.REACT_APP_BACKENDURL || process.env.REACT_APP_BACKENDURL_PROD

function App() {
  const [state, dispatch] = useReducer(AppReducer, initialState)
  const { loggedIn, user, flashMessages, isSearchOpen } = state

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem('complexappToken', user.token)
      localStorage.setItem('complexappUsername', user.username)
      localStorage.setItem('complexappAvatar', user.avatar)
    } else {
      localStorage.removeItem('complexappToken')
      localStorage.removeItem('complexappUsername')
      localStorage.removeItem('complexappAvatar')
    }
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      const AxiosRequest = Axios.CancelToken.source()

      Axios.post('/checkToken', { token: user.token }, { cancelToken: AxiosRequest.token }).then(res => {
        if (!res.data) {
          dispatch({ type: APP_ACTIONS.logout })
          dispatch({ type: APP_ACTIONS.flashMessage, value: 'Your session has expired. Please log in again' })
        }
      })

      return () => AxiosRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={flashMessages} />
          <Header />
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path='/' exact component={Home} />

              <Route path='/create-post' component={CreatePost} />
              <Route path='/post/:id' exact component={SinglePost} />
              <Route path='/post/:id/edit' exact component={EditPost} />

              <Route path='/profile/:username' component={Profile} />

              <Route path='/about-us' component={About} />
              <Route path='/terms' component={Terms} />

              <Route component={NotFound} />
            </Switch>
          </Suspense>

          <CSSTransition timeout={330} in={isSearchOpen} classNames='search-overlay' unmountOnExit>
            <div className='search-overlay'>
              <Suspense fallback=''>
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback=''>{loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
