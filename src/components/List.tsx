import { useEffect, useState, useCallback } from 'react'
import {
	getFeedPostsByName,
	getSuggestedPostsByName,
	PER_PAGE,
	Profile
} from '../api/api'

import Pagination from './Pagination'
import HeaderLinks from './HeaderLinks'
import { setWindowParam, getWindowParam, tweet } from '../utils'
import { Search } from './Search'
import { Post } from './Post'
import { useLoaderProvider } from './loader/LoaderProvider'
import { Tooltip } from './Tooltip'

const isFeed = () => true // window.location.pathname.indexOf('/feed') !== -1

export const loader = async (page: number, search: string, personalHandle?: string) => {
	const [results] = await Promise.all([
		isFeed() ? getFeedPostsByName(search, personalHandle) : getSuggestedPostsByName(search),
	])

	const data = {
		results: results || [],
		page,
		count: 1
	}

	return data
}

const getInitialPage = () => {
	return +getWindowParam('page') || 1
}


export default function List(props: any) {

	const [data, setData] = useState({
		results: [] as Profile[],
		page: getInitialPage(),
		count: 0
	})

	const [page, setPage] = useState(getInitialPage())
	const [search, setSearch] = useState(getWindowParam('strategy') || 'recent')
	// input var
	const [personalHandle, setPersonalHandle] = useState(getWindowParam('personalHandle') || '')
	// strategy var
	const [personalHandleStrategy, setPersonalHandleStrategy] = useState('')

	const { state: loaderState, dispatch: loaderActions } = useLoaderProvider()


	const filterData = useCallback((s: string) => {
		setWindowParam('strategy', s)
		setWindowParam('personalHandle', personalHandle)
		setPersonalHandleStrategy(personalHandle)
		setSearch(s)
		setPage(1)
	}, [personalHandle])


	useEffect(() => {
		loaderActions({ type: 'SET_LOADING', isLoading: true })
		const run = async () => {
			try {
				const d = await loader(page, search, personalHandle)
				setData(d)
			} catch (e) { }
			loaderActions({ type: 'SET_LOADED', isLoading: false })
		}

		run()
	}, [page, search, personalHandleStrategy])


	return (
		<main>
			<header>
				<HeaderLinks />
				<div className="logos logos-grid">
					<div className='logo-container-1'>
						<a href="https://k3l.io" target="_blank" rel="noreferrer">
							<img
								width="180px"
								src="/images/logo.svg"
								draggable="false"
								alt="Karma3Labs Logo"
							/>
						</a>
					</div>
					<div className="line"></div>
					<div className='logo-container-2'>
						<a href="https://www.lens.xyz/" target="_blank" rel="noreferrer">
							<img
								width="50px"
								src="/images/lens.svg"
								draggable="false"
								alt="Lens Logo"
							/>
						</a>
					</div>
				</div>
				<div className="title">
					<h1>Content Feed</h1>
					<h6>Openly Verifiable Content Feed powered by EigenTrust</h6>
				</div>
				{!isFeed() && <>
					<div className="strategies">

					</div>
					<Search onSearch={filterData} initialValue={search} />


					<button className="twitter"
						style={{ marginTop: 30 }}
						onClick={() => tweet('Check out the Open NFT Rankings here:')}
					>
						<i></i>&nbsp;Share
					</button>
				</>}
			</header>
			<div className="container">
				<br />
				<div className="strategy-btn-wrapper">
					{[
						{ name: 'Recent', strategy: 'recent', isDisabled: false },
						{ name: 'Popular', strategy: 'popular', isDisabled: false },
						{ name: 'Recommended', strategy: 'recommended', isDisabled: false },
						{ name: 'Crowdsourced', strategy: 'crowdsourced', isDisabled: false }
					].map(btn => {
						return <>
							<Tooltip text={'Coming Soon'} isActive={btn.isDisabled}>
								<div
									onClick={() => !btn.isDisabled && filterData(btn.strategy)}
									className={"strategy-btn" + (search === btn.strategy ? ' active-strategy-btn' : '')
										+ (btn.isDisabled ? ' disabled' : '')}
									style={{ textTransform: 'capitalize', marginRight: 20 }}>
									{btn.name}</div>
							</Tooltip>
						</>
					})}
				</div>
				<br />
				<div className="strategy-input-wrapper">
					<input
						value={personalHandle}
						onChange={(e) => {
							const v = e.target.value.toLowerCase()
							setPersonalHandle(v)
						}}
						onKeyDown={(e) => {
							if (e.keyCode !== 13) {
								return
							}

							filterData('personal')
						}}
						className="strategy-input"
						type="text" placeholder="Enter your handle" />
					<div

						onClick={() => filterData('personal')}
						className={"strategy-btn" + (search === 'personal' ? ' active-strategy-btn' : '')}
						style={{ textTransform: 'capitalize', marginLeft: -410, height: 32, marginTop: 4, boxShadow: 'none', border: '1px solid lightgrey' }}>
						Following</div>
				</div>
				<div className="scroll" style={{ marginTop: 10 }}>
					<div className="profiles-container">
						{data.results.map((e, i) => {
							const isLast = data.results.length === i + 1

							return <div key={e.id} className="post-wrapper">

								<Post
									key={e.postId}
									isLast={isLast}
									data={e} />

							</div>
						})

						}
						<div>
							{data.results.length === 0 && <div></div>}
						</div>
						<Pagination
							numberOfPages={Math.ceil(data.count / PER_PAGE)}
							currentPage={data.page}
							cb={p => setPage(p)}
						/>
					</div>
				</div>
			</div>
		</main >
	)
}

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<main>
			<div className="container">
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		</main>
	)
}
