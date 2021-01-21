import { LOGIN_ACTIONS } from './LoginActions'

const LoginReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_ACTIONS.usernameImmediately: {
      let { username } = state

      return {
        ...state,
        username: {
          ...username,
          value: action.value,
          hasErrors: !Boolean(action.value.length)
        }
      }
    }

    case LOGIN_ACTIONS.passwordImmediately: {
      let { password } = state

      return {
        ...state,
        password: {
          ...password,
          value: action.value,
          hasErrors: !Boolean(action.value.length)
        }
      }
    }

    case LOGIN_ACTIONS.submitForm: {
      let isFormValid = !state.username.hasErrors && !state.password.hasErrors

      return {
        ...state,
        submitCount: isFormValid ? state.submitCount + 1 : state.submitCount
      }
    }

    default: {
      return state
    }
  }
}

const loginInitialState = {
  username: {
    value: '',
    hasErrors: false
  },

  password: {
    value: '',
    hasErrors: false
  },

  submitCount: 0
}

export { LoginReducer, loginInitialState }
