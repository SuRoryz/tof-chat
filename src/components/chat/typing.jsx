import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined'
import SettingsIcon from '@mui/icons-material/SettingsSuggestOutlined'
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined'

import { Drawer } from '../Drawer'
import { GAME_RESOURCES } from '../../utils'
import { ReactComponent as SendMessageSvg } from '../../assets/svg/sendMessage.svg'

export const TypingPanel = (props) => {
    const { autoScrollEndRef, socket, connectedSocket, isLoaded } = props
    const { MAX_LIMIT_SYMBOLS_MESSAGE } = GAME_RESOURCES

    const [inputMessage, setInputMessage] = useState('')
    const [lockEndMessage, setLockEndMessage] = useState(true)
    const [drawerSettingsOpen, setDrawerSettingsOpen] = useState(false)
    const [drawerStickersOpen, setDrawerStickersOpen] = useState(false)

    useEffect(() => {
        let interval = null

        if (lockEndMessage) {
            interval = setInterval(() => autoScrollEndRef.current?.scrollIntoView({ behavior: 'smooth' }))
        } else if (!lockEndMessage) {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [autoScrollEndRef, lockEndMessage])

    const onLockEndMessageHandler = () => setLockEndMessage(!lockEndMessage)

    const onMessageHandler = (e) => setInputMessage((e.target.value ?? '').substring(0, MAX_LIMIT_SYMBOLS_MESSAGE))
    
    const onKeyPressSendMessageHandler = ({ key }) => key === 'Enter' && onSendMessageHandler()

    const onSendMessageHandler = () => {
        if(connectedSocket && inputMessage.length) {
            socket.send(JSON.stringify({
                text: inputMessage,
                avatar: 'Avatar56',
                bubble: 47,
                frame: 47,
                level: 0,
                nickname: 'Silvercoast Lab',
                sex: 1,
                suppressors: '1_3',
                title: '1_1_6_1'
            }))
            setInputMessage('')
        }
    }

    const onDrawerSettingsOpenHandler = () => !drawerSettingsOpen && setDrawerSettingsOpen(true)
    const onDrawerStickersOpenHandler = () => !drawerStickersOpen && setDrawerStickersOpen(true)

    const SettingsDrawer = (
        <Drawer
            position='bottom'
            open={drawerSettingsOpen}
            onOpen={onDrawerSettingsOpenHandler}
            onClose={() => setDrawerSettingsOpen(false)}
        >
            <span>TODO Settings</span>
        </Drawer>
    )

    const StickersDrawer = (
        <Drawer
            position='bottom'
            open={drawerStickersOpen}
            onOpen={onDrawerStickersOpenHandler}
            onClose={() => setDrawerStickersOpen(false)}
        >
            <span>TODO Stickers</span>
        </Drawer>
    )

    if(!connectedSocket || !isLoaded) {
        return null
    }

    return (
        <div className='typing-panel'>
            {SettingsDrawer}
            {StickersDrawer}
            <div className='typing-container'>
                {((!inputMessage.length && isMobile) || !isMobile) && (
                    <>
                        <button className='settings-message' onClick={onDrawerSettingsOpenHandler}>
                            <SettingsIcon/>
                        </button>
                        <button className='stickers-message' onClick={onDrawerStickersOpenHandler}>
                            <AddReactionOutlinedIcon/>
                        </button>
                    </>
                )}
                <button className='lockend-message' onClick={onLockEndMessageHandler}>
                    {(!lockEndMessage
                        ? <LockOpenIcon/>
                        : <LockIcon/>
                    )}
                </button>
                <input
                    type='text'
                    placeholder='Type a message...'
                    value={inputMessage}
                    onChange={onMessageHandler}
                    onKeyPress={onKeyPressSendMessageHandler}
                />
                {(inputMessage.length > 0) && (
                    <small
                        className='symbols-input-length'
                        style={{ color: inputMessage.length >= MAX_LIMIT_SYMBOLS_MESSAGE && '#997146' }}
                    >
                        {inputMessage.length}/{MAX_LIMIT_SYMBOLS_MESSAGE} (symbols limit)
                    </small>
                )}
                <button className='send-message' onClick={onSendMessageHandler}>
                    <SendMessageSvg/>
                </button>
            </div>
        </div>
    )
}
