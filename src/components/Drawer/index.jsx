import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

export const Drawer = (props) => {
    const { position, open, onClose, onOpen, children } = props

    return (
        <SwipeableDrawer
            anchor={position ?? 'bottom'}
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            swipeAreaWidth={0}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
        >
            {children}
        </SwipeableDrawer>
    )
}
