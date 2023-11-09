import { Action, State } from "./types"

export const initialState = {
    isLoading: false,
}

// Reducer function
export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: true }
        case 'SET_LOADED':
            return { ...state, isLoading: false }
        default:
            return state
    }
}