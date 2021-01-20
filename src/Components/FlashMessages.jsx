import React from 'react'

function FlashMessages({ messages, color = 'success' }) {
  const alertColor =
    {
      success: 'alert-success',
      secondary: 'alert-secondary',
      primary: 'alert-primary',
      danger: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info',
      light: 'alert-light',
      dark: 'alert-dark'
    } || 'alert-success'

  return (
    <div className='floating-alerts'>
      {messages.map((msg, index) => {
        return (
          <div key={index} className={`alert ${alertColor[color]} text-center floating-alert shadow-sm`}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
