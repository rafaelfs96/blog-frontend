import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import io from 'socket.io-client'

import { StateContext, DispatchContext } from '../Contexts/AppContext'
import { APP_ACTIONS } from '../Reducers/AppReducer/AppActions'

function Chat() {
  const [{ fieldValue, chatMessages }, setState] = useState({
    fieldValue: '',
    chatMessages: []
  })

  const socket = useRef(null)
  const chatField = useRef(null)
  const chatLog = useRef(null)

  const { isChatOpen, user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus()
      appDispatch({ type: APP_ACTIONS.clearUnreadChatCount })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen])

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_BACKENDURL || process.env.REACT_APP_BACKENDURL_PROD)

    socket.current.on('chatFromServer', message => {
      setState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, message] }))
    })

    return () => socket.current.disconnect()
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if (!isChatOpen && chatMessages.length) {
      appDispatch({ type: APP_ACTIONS.incrementUnreadChatCount })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages])

  const handleSubmit = evt => {
    evt.preventDefault()

    if (fieldValue) {
      socket.current.emit('chatFromBrowser', {
        message: fieldValue,
        token: user.token
      })

      let newMessage = {
        message: fieldValue,
        username: user.username,
        avatar: user.avatar
      }

      setState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, newMessage],
        fieldValue: ''
      }))
    }
  }

  return (
    <div id='chat-wrapper' className={`chat-wrapper shadow border-top border-left border-right ${isChatOpen ? 'chat-wrapper--is-visible' : ''}`}>
      <div className='chat-title-bar bg-primary'>
        Chat
        <span onClick={() => appDispatch({ type: APP_ACTIONS.closeChat })} className='chat-title-bar-close'>
          <i className='fas fa-times-circle'></i>
        </span>
      </div>
      <div id='chat' className='chat-log' ref={chatLog}>
        {chatMessages.map((message, index) => {
          if (message.username === user.username) {
            return (
              <div key={index} className='chat-self'>
                <div className='chat-message'>
                  <div className='chat-message-inner'>{message.message}</div>
                </div>
                <img className='chat-avatar avatar-tiny' alt={message.username} title={message.username} src={message.avatar} />
              </div>
            )
          } else {
            return (
              <div key={index} className='chat-other'>
                <Link to={`/profile/${message.username}`}>
                  <img className='avatar-tiny' src={message.avatar} alt={message.username} title={message.username} />
                </Link>
                <div className='chat-message'>
                  <div className='chat-message-inner'>
                    <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>
      <form onSubmit={handleSubmit} id='chatForm' className='chat-form border-top'>
        <input value={fieldValue} onChange={evt => setState(prev => ({ ...prev, fieldValue: evt.target.value }))} ref={chatField} type='text' className='chat-field' id='chatField' placeholder='Type a message…' autoComplete='off' />
      </form>
    </div>
  )
}

export default Chat
