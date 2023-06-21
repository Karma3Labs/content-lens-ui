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
	const [search, setSearch] = useState(getWindowParam('strategy') || 'latest')
	const [personalHandle, setPersonalHandle] = useState(getWindowParam('personalHandle') || '')
	

	const filterData = useCallback((s: string) => {
		setWindowParam('strategy', s)
		setWindowParam('personalHandle', personalHandle)
		setSearch(s)
		setPage(1)
	}, [])


	useEffect(() => {
		const run = async () => {
			const d = await loader(page, search, personalHandle)
			setData(d)
		}

		run()
	}, [page, search])


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
				<div>
					{[
						{name: 'Recent', strategy: 'latest'}, 
						{name: 'Popular', strategy: 'engagement-viralPosts'}, 
						{name: 'Recommended', strategy: 'ml-xgb-followship'},
						{name: 'Crowdsourced', strategy: 'crowdsourced'}
					].map(btn => {
						return <div
							onClick={() => filterData(btn.strategy)}
							className={"strategy-btn" + (search === btn.strategy ? ' active-strategy-btn' : '')}
							style={{ textTransform: 'capitalize', marginRight: 20 }}>
							{btn.name}</div>
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
						className="strategy-input"
						type="text" placeholder="Enter your handle" />
					<div

						onClick={() => filterData('personal')}
						className={"strategy-btn" + (search === 'personal' ? ' active-strategy-btn' : '')}
						style={{ textTransform: 'capitalize', marginRight: 20 }}>
						Personal</div>
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
