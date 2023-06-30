export type State = {
    isLoading: boolean
}

export type Action = {
    isLoading?: boolean
    type: 'SET_LOADING' | 'SET_LOADED'
}