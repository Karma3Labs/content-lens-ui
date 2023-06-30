import { Action, State } from "./types"
import { reducer, initialState } from './reducer'
import React, { createContext, useReducer, FC, useContext } from "react"



export const LoaderContext = createContext<{
    state: State,
    dispatch: React.Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => { throw Error('Not loaded!') }
})

// Create the provider component
export const LoaderProvider: React.FC<any> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <LoaderContext.Provider value={{ state, dispatch }}>
            {children}
        </LoaderContext.Provider>
    )
}

export const useLoaderProvider = () => useContext(LoaderContext)