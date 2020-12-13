import { APP_ACTIONS } from './AppActions'

const AppReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.login:
      return {
        ...state,
        loggedIn: true,
        user: action.value
      }

    case APP_ACTIONS.logout:
      return {
        ...state,
        loggedIn: false
      }

    case APP_ACTIONS.flashMessage:
      return {
        ...state,
        flashMessages: [...state.flashMessages, action.value]
      }

    case APP_ACTIONS.openSearch:
      return {
        ...state,
        isSearchOpen: true
      }

    case APP_ACTIONS.closeSearch:
      return {
        ...state,
        isSearchOpen: false
      }

    case APP_ACTIONS.toogleChat:
      return {
        ...state,
        isChatOpen: !state.isChatOpen
      }

    case APP_ACTIONS.closeChat:
      return {
        ...state,
        isChatOpen: false
      }

    case APP_ACTIONS.incrementUnreadChatCount:
      return {
        ...state,
        unreadChatCount: state.unreadChatCount + 1
      }

    case APP_ACTIONS.clearUnreadChatCount:
      return {
        ...state,
        unreadChatCount: 0
      }

    default:
      return state
  }
}

const initialState = {
  loggedIn: Boolean(localStorage.getItem('complexappToken')),
  flashMessages: [],
  user: {
    token: localStorage.getItem('complexappToken'),
    username: localStorage.getItem('complexappUsername'),
    avatar: localStorage.getItem('complexappAvatar')
  },
  isSearchOpen: false,
  isChatOpen: false,
  unreadChatCount: 0
}

export { AppReducer, initialState }
