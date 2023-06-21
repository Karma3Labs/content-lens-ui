import React, { useState } from 'react'
import { useLoaderProvider } from './LoaderProvider'

export const Loader = (props: any) => {

    const { state: loaderState, dispatch: loaderActions } = useLoaderProvider()

    if (!loaderState.isLoading) {
        return null
    }

    return (
        <div className="loader-container">
            <div style={{ position: 'absolute', textAlign: 'right', bottom: 20, right: 20 }}>
                <img style={{ width: 50, height: 50 }} src='images/loader.svg' />
            </div>
        </div>
    )
}
