"use client"
import React, { ReactNode } from 'react'
import { Provider } from 'jotai'


const StateProvider = ({ children }: {
    children: ReactNode
}) => {
    return (
        <>
            <Provider>
                {children}
            </Provider>
        </>
    )
}

export default StateProvider