import React, {useState, useEffect, useCallback} from 'react'

import {Chat} from './components/Chat'

const App = () => {
  const [instSocket, setInstSocket] = useState(null)
  const [connectedSocket, setConnectedSocket] = useState(false)
  const [countReconnectSocket, setCountReconnectSocket] = useState(0)

  const pingSocket = useCallback((socket) => {
    if(!socket || socket.readyState !== 1) return
    console.info('Socket - ping', Date.now())
    socket.send('ping')
    setTimeout(() => pingSocket(socket), 1000)
  }, [])

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS)

    socket.onopen = () => {
      console.info('Socket - Connection successfully')
      setConnectedSocket(true)
      setInstSocket(socket)
      setCountReconnectSocket(0)
    }

    socket.onerror = (e) => {
      console.error('Socket - Connection error', e)
      setConnectedSocket(false)
    }

    socket.onclose = ({ wasClean, code, reason }) => {
      setConnectedSocket(false)

      if (wasClean) {
        console.warn('Socket - Connection closed\nCode:', code, '\nCause:', reason)
        return
      }

      console.warn('Connection terminated. Reconnecting...')
      setCountReconnectSocket(countReconnectSocket + 1)
      setTimeout(() => pingSocket(socket), 10000)
      setTimeout(() => setInstSocket(null), 5000)
    }
  }, [countReconnectSocket, pingSocket])

  return (
    <div className='App'>
      <Chat
        socket={instSocket}
        connectedSocket={connectedSocket}
        countReconnectSocket={countReconnectSocket}
      />
    </div>
  )
}

export default App
