import { useEffect, useState, useCallback } from 'react'
import {
	getFeedPostsByName,
	getSuggestedPostsByName,
	PER_PAGE,
	Profile,
	Strategy,
} from '../api/api'

import Pagination from './Pagination'
// import HeaderLinks from './HeaderLinks'
import { setWindowParam, getWindowParam, tweet } from '../utils'
import { Search } from './Search'
import { Post } from './Post'
import { useLoaderProvider } from './loader/LoaderProvider'
import { Tooltip } from './Tooltip'

const isFeed = () => true // window.location.pathname.indexOf('/feed') !== -1

export const loader = async (page: number, search: string, isV2: boolean, personalHandle?: string) => {
	const [results] = await Promise.all([
		isFeed() ? getFeedPostsByName(search, isV2, personalHandle) : getSuggestedPostsByName(search),
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
	const [isV2, setIsV2] = useState<boolean>(getWindowParam('isV2') === 'true' || true)

	const { state: loaderState, dispatch: loaderActions } = useLoaderProvider()


	const filterData = useCallback(({ strategy, isV2 }: { strategy: Strategy, isV2: boolean }) => {
		setWindowParam('strategy', strategy)
		setWindowParam('personalHandle', personalHandle)
		setWindowParam('isV2', isV2 ? 'true' : 'false');
		setPersonalHandleStrategy(personalHandle)
		setSearch(strategy)
		setIsV2(isV2)
		setPage(1)
	}, [personalHandle])


	useEffect(() => {
		loaderActions({ type: 'SET_LOADING', isLoading: true })
		const run = async () => {
			try {
				const d = await loader(page, search, isV2, personalHandle)
				setData(d)
			} catch (e) { }
			loaderActions({ type: 'SET_LOADED', isLoading: false })
		}

		run()
	}, [page, search, personalHandleStrategy, loaderActions, personalHandle, isV2])


	return (
		<main>
			<header>
				{/* <HeaderLinks /> */}
				<div className='header-titles'>
					<div className="logos logos-flex">
						<a href="https://k3l.io" target="_blank" rel="noreferrer">
							<img
								width="180px"
								src="/images/k3l_logo_transparent.png"
								draggable="false"
								alt="Karma3Labs Logo"
							/>
						</a>
						<div className="line"></div>
						<a href="https://www.lens.xyz/" target="_blank" rel="noreferrer">
							<img
								width="50px"
								src="/images/lens_logo_transparent.svg"
								draggable="false"
								alt="Lens Logo"
							/>
						</a>
					</div>
					<div className="title">
						<h1 className='header-text'>Content Feed</h1>
						<h6 className='subheader-text'>Openly Verifiable Content Feed powered by EigenTrust</h6>
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
				</div>
			</header>
			<div className="container">
				<div className="strategy-btn-wrapper">
					{[
						{ name: 'Recent', strategy: Strategy.Recent, isDisabled: false, isV2: true },
						// Popular is very similar to Photography & Art, so commenting out.
						// { name: 'Popular', strategy: Strategy.Popular, isDisabled: false, isV2: true },
						// Recommended is hard to explain. Commenting out for now for DevConnect.
						// { name: 'Recommended', strategy: Strategy.Recommended, isDisabled: false, isV2: true },
						// Crowdsourced is hard to explain. Commenting out for now for DevConnect.
						// { name: 'Crowdsourced', strategy: Strategy.Crowdsourced, isDisabled: false, isV2: true },
						{ name: 'Photography', strategy: Strategy.PhotographyAndArt, isDisabled: false, isV2: true },
						{ name: 'Newcomer', strategy: Strategy.NewComer, isDisabled: false, isV2: true },
						{ name: 'Spam', strategy: Strategy.Spam, isDisabled: false, isV2: true },
					].map(btn => {
						return <>
							<Tooltip text={'Coming Soon'} isActive={btn.isDisabled} key={btn.strategy}>
								<button
									className={"strategy-btn" + (search === btn.strategy ? 'strategy-btn active-strategy-btn' : '')
									+ (btn.isDisabled ? ' disabled' : '')}
									onClick={() => !btn.isDisabled && filterData({ strategy: btn.strategy, isV2: btn.isV2 })}
								>
									{btn.name}
								</button>
							</Tooltip>
						</>
					})}
				</div>
				{/* <div className="strategy-input-wrapper">
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

							filterData({ strategy: Strategy.Personal, isV2: true })
						}}
						className="strategy-input"
						type="text" placeholder="Enter your handle" />
					<div

						onClick={() => filterData({ strategy: Strategy.Personal, isV2: true })}
						className={"strategy-btn" + (search === Strategy.Personal ? ' active-strategy-btn' : '')}
						style={{ textTransform: 'capitalize', marginLeft: -410, height: 32, marginTop: 4, boxShadow: 'none', border: '1px solid lightgrey' }}>
						Following</div>
				</div> */}
				<div className="scroll feed-wrapper">
					<div className="profiles-container">
						{data.results.map((e, i) => {
							const isLast = data.results.length === i + 1

							return <Post
								key={e.postId}
								isLast={isLast}
								data={e} />
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
