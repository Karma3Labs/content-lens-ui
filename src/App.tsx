import './App.css';
import List from './components/List'
import { useState } from 'react'
// import { getStrategies } from './api/api';
import { SearchAutocomplete } from './components/SearchAutocomplete'
import { setWindowParam } from './utils';
import { useCallback } from 'react'
import { LoaderProvider } from './components/loader/LoaderProvider'
import { Loader } from './components/loader/Loader'

const isRankingPage = () => window.location.pathname.indexOf('/rankings') !== -1

function App() {
  const [isRanking, setIsRanking] = useState(isRankingPage)

  const onSearchAutocomplete = useCallback((s: string) => {
    window.history.pushState({}, '', '/rankings')
    setWindowParam('page', '1')
    setWindowParam('search', s)
    setIsRanking(true)
  }, [])

  if (isRanking) {
    return (
      <LoaderProvider>
        <div className="App">
          <SearchAutocomplete
            setMode={setIsRanking}
            onSearch={onSearchAutocomplete} />
        </div>
      </LoaderProvider>
    )
  }

  return (
    <LoaderProvider>
      <Loader />
      <div className="App">
        <List />
      </div>
    </LoaderProvider>
  );
}

export default App;