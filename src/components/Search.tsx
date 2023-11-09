import { useState } from 'react'
import { throttle } from '../utils'

const throttled = throttle(500)

export const Search = (props: any) => {
    const cb = props.onSearch
    const [search, setSearch] = useState(props.initialValue || '')
    const [suggestions, setSuggestions] = useState([] as any)

    const handleSuggestionClick = (suggestion: any) => {
        cb(suggestion)
        setSearch(suggestion)
        setSuggestions([])
    }

    return (
        <div className="search">
            <input
                type="text"
                name="handle"
                placeholder="Search stani.lens"
                value={search}
                onChange={(e) => {
                    const v = e.target.value.toLowerCase()
                    setSearch(v)
                    throttled(() => cb(v))
                }}
            />
            {false && suggestions.length > 0 && (
                <div className="suggestions">
                    {suggestions.map((s: any) => (
                        <div className="suggestions-li" key={s} onClick={() => handleSuggestionClick(s)}>
                            {s}
                        </div>
                    ))}
                </div>
            )}


            {(
                <button
                    className="btn"
                    type="button"
                    onClick={() => {
                        cb('')
                        setSearch('')
                    }}
                >
                    Clear
                </button>
            )}

        </div>
    )
}
