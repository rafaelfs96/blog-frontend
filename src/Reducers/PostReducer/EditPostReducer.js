import { EDIT_POST_ACTIONS } from './EditPostActions'

const editPostReducer = (state, action) => {
  switch (action.type) {
    case EDIT_POST_ACTIONS.fetchComplete: {
      let { title, body } = state
      return {
        ...state,
        title: {
          ...title,
          value: action.value.title
        },
        body: {
          ...body,
          value: action.value.body
        },
        isFetching: false
      }
    }

    case EDIT_POST_ACTIONS.titleChange: {
      let { title } = state
      return {
        ...state,
        title: {
          ...title,
          value: action.value,
          hasErrors: false
        }
      }
    }

    case EDIT_POST_ACTIONS.bodyChange: {
      let { body } = state
      return {
        ...state,
        body: {
          ...body,
          value: action.value,
          hasErrors: false
        }
      }
    }

    case EDIT_POST_ACTIONS.submitRequest: {
      if (!state.title.hasErrors && !state.body.hasErrors) {
        let sendCount = state.sendCount + 1
        return {
          ...state,
          sendCount
        }
      }
      return state
    }

    case EDIT_POST_ACTIONS.saveRequestStarted: {
      return {
        ...state,
        isSaving: true
      }
    }

    case EDIT_POST_ACTIONS.saveRequestFinished: {
      return {
        ...state,
        isSaving: false
      }
    }

    case EDIT_POST_ACTIONS.titleRules: {
      let { title } = state

      let hasErrors = false
      let message = ''

      if (!action.value.trim()) {
        hasErrors = true
        message = 'You must provide a title.'
      }

      return {
        ...state,
        title: {
          ...title,
          hasErrors,
          message
        }
      }
    }

    case EDIT_POST_ACTIONS.bodyRules: {
      let { body } = state

      let hasErrors = false
      let message = ''

      if (!action.value.trim()) {
        hasErrors = true
        message = 'You must provide body content.'
      }

      return {
        ...state,
        body: {
          ...body,
          hasErrors,
          message
        }
      }
    }

    case EDIT_POST_ACTIONS.notFound: {
      return {
        ...state,
        notFound: true
      }
    }

    default:
      return state
  }
}

const EDIT_POST_INITIAL_STATE = paramId => ({
  title: {
    value: '',
    hasErrors: false,
    message: ''
  },
  body: {
    value: '',
    hasErrors: false,
    message: ''
  },
  isFetching: true,
  isSaving: false,
  id: paramId,
  sendCount: 0,
  notFound: false
})

export { EDIT_POST_INITIAL_STATE, editPostReducer }
