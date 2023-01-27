import React, { useRef, useState, useEffect } from 'react'
import dateFormat from 'dateformat'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

import './chat.css'
import './chat.mobile.css'
import { htmlParseByMessages, filterDublicateMessagesByHashId } from '../../utils'
import { Linear } from '../Linear'
import { TypingPanel } from './typing'
import { ServiceApi } from '../../api'
import { SOCKET_TYPES } from '../../utils/constants'

export const Chat = (props) => {
    const { socket, connectedSocket, countReconnectSocket } = props

    const [messages, setMessages] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const fetchHistoryRef = useRef(false)
    const autoScrollEndRef = useRef(null)

    useEffect(() => {
        if(connectedSocket && !fetchHistoryRef.current) {
            fetchHistoryRef.current = true
            
            ServiceApi.getChatHistory()
                .then((data) => {
                    const history = data?.items ?? []

                    setMessages(htmlParseByMessages([
                        ...history,
                        ...messages
                    ]))
                })
                .catch(err => console.error(err))
        }
    }, [connectedSocket, messages])

    const getDataOnMessageData = (data) => {
        let d = null

        try {
            d = JSON.parse(data)
        } catch (e) {
            console.warn(e)
            d = JSON.parse(JSON.parse(data))
        }

        return d
    }
      
    useEffect(() => {
        if(socket !== null && connectedSocket && fetchHistoryRef.current) {
            setIsLoaded(true)

            socket.addEventListener('message', ({ data }) => {
                const parseData = getDataOnMessageData(data)
                
                switch(parseData.type) {
                    case SOCKET_TYPES.WORLD_CHAT:
                        setMessages(filterDublicateMessagesByHashId([
                            ...messages,
                            ...htmlParseByMessages({
                                ...parseData,
                                message: parseData.message
                            })
                        ]))
                        break;
                    case SOCKET_TYPES.PING:
                        console.info('Socket - pong', Date.now())
                        break;
                    default:
                }
            })
        } else if (socket === null || !connectedSocket) {
            setIsLoaded(false)
        }
    }, [socket, connectedSocket, messages])

    const RenderMessageList = (!isLoaded
        ? (<Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Typography
                    variant='h5'
                    gutterBottom={true}
                    noWrap={true}
                    color={'#a7caed'}
                    sx={{
                        marginBottom: (countReconnectSocket > 1) ? 0 : '10px'
                    }}
                >
                    {connectedSocket ? 'Loading message history...' : 'Сonnection to the server...'}
                </Typography>
                {(countReconnectSocket > 1) && (
                    <Typography
                        variant='caption'
                        gutterBottom={true}
                        noWrap={true}
                        color={'#8e8e8e'}
                    >
                        Count reconnection: {countReconnectSocket}
                    </Typography>
                )}
                <Linear />
            </Box>)
        : (<>
                {messages.map(({ hash_id, nickname, message, sticker, timestamp }) => {
                    return (
                        <div
                            key={hash_id}
                            className='message-container'
                        >
                            <div className='message-person'>
                                <Avatar
                                    alt={nickname}
                                    src='https://i.playground.ru/p/E8xN0ppw6ttDuoB0AuyMyg.png'
                                    sx={{ width: 35, height: 35 }}
                                />
                            </div>
                            <div className='message-context'>
                                <div className='message-author'>
                                    <span>{nickname}</span>
                                </div>
                                <div className='message-context-item'>
                                    <span>{(message || sticker) ?? 'unknown message'}</span>
                                    <small>{dateFormat(timestamp, 'HH:MM')}</small>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={autoScrollEndRef} />
            </>
        )
    )

    return (
        <div className='chat'>
            <div className='chat-container'>
                {RenderMessageList}
            </div>
            <TypingPanel
                socket={socket}
                isLoaded={isLoaded}
                connectedSocket={connectedSocket}
                autoScrollEndRef={autoScrollEndRef}
            />
        </div>
    )
}
