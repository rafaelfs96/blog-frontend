import { SIGNUP_ACTION } from './SignupActions'

const SignupReducer = (state, action) => {
  switch (action.type) {
    case SIGNUP_ACTION.usernameImmediately: {
      let { username } = state

      let moreThan30 = action.value.length > 30
      let specialChar = action.value && !/^([a-zA-Z0-9]+)$/.test(action.value)

      let message = moreThan30 ? 'Username cannot exceed 30 characters.' : ''
      message = specialChar ? 'Username can only contain letters and numbers' : message

      return {
        ...state,
        username: {
          ...username,
          hasErrors: moreThan30 || specialChar,
          message,
          value: action.value
        }
      }
    }

    case SIGNUP_ACTION.usernameAfterDelay: {
      let { username } = state

      if (username.hasErrors) return state

      let checkCount = username.checkCount

      let lessThan3 = username.value.length < 3

      if (!lessThan3 && !action.noRequest) checkCount += 1

      return {
        ...state,
        username: {
          ...username,
          hasErrors: lessThan3,
          message: lessThan3 ? 'Username must me at least 3 characters' : '',
          checkCount
        }
      }
    }

    case SIGNUP_ACTION.usernameUniqueResults: {
      let { username } = state

      let usernameExists = action.value

      return {
        ...state,
        username: {
          ...username,
          hasErrors: usernameExists,
          isUnique: !usernameExists,
          message: usernameExists ? 'That username is already taken' : ''
        }
      }
    }

    case SIGNUP_ACTION.emailImmediately: {
      let { email } = state
      return {
        ...state,
        email: {
          ...email,
          hasErrors: false,
          value: action.value
        }
      }
    }

    case SIGNUP_ACTION.emailAfterDelay: {
      let { email } = state

      let checkCount = email.checkCount

      let validEmail = /^\S+@\S+$/.test(email.value)

      if (validEmail && !action.noRequest) checkCount += 1

      return {
        ...state,
        email: {
          ...email,
          hasErrors: !validEmail,
          message: !validEmail ? 'You must provide a valid email address' : '',
          checkCount
        }
      }
    }

    case SIGNUP_ACTION.emailUniqueResults: {
      let { email } = state

      let emailExists = action.value

      return {
        ...state,
        email: {
          ...email,
          hasErrors: emailExists,
          isUnique: !emailExists,
          message: emailExists ? 'That email is already being used' : ''
        }
      }
    }

    case SIGNUP_ACTION.passwordImmediately: {
      let { password } = state

      let moreThan50 = action.value.length > 50

      return {
        ...state,
        password: {
          ...password,
          hasErrors: moreThan50,
          message: moreThan50 ? 'Password cannot exceed 50 characters.' : '',
          value: action.value
        }
      }
    }

    case SIGNUP_ACTION.passwordAfterDelay: {
      let { password } = state

      if (password.hasErrors) return state

      let lessThan12 = password.value.length < 12

      return {
        ...state,
        password: {
          ...password,
          hasErrors: lessThan12,
          message: lessThan12 ? 'Password must be at least 12 characters.' : ''
        }
      }
    }

    case SIGNUP_ACTION.submitForm: {
      let isFormValid = !state.username.hasErrors && state.username.isUnique && !state.email.hasErrors && state.email.isUnique && !state.password.hasErrors

      return {
        ...state,
        submitCount: isFormValid ? state.submitCount + 1 : 0
      }
    }

    default:
      return state
  }
}

const signupInitialState = {
  username: {
    value: '',
    message: '',
    hasErrors: false,
    isUnique: false,
    checkCount: 0
  },
  email: {
    value: '',
    message: '',
    hasErrors: false,
    isUnique: false,
    checkCount: 0
  },
  password: {
    value: '',
    message: '',
    hasErrors: false
  },
  submitCount: 0
}

export { SignupReducer, signupInitialState }
