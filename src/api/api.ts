export enum Strategy {
	Personal = 'personal',
	Recent = 'recent',
	Popular = 'popular',
	Recommended = 'recommended',
	Crowdsourced = 'crowdsourced',
	PhotographyAndArt = 'photoart',
	NewComer = 'newcomer',
	Spam = 'spam',
}

export interface Profile {
	id: string,
	timestamp: string,
	contentUri: string,
	postId: string,
	createdAt: string
}

enum MainContentFocus {
	Mint = "MINT",
	Image = "IMAGE",
	TextOnly = "TEXT_ONLY",
	Embed = "EMBED",
	Video = "VIDEO",
}

interface ContentHeyOrOrb {
	id: string,
	appId: string; // "Hey", "orb"
	locale: string,
	mainContentFocus: MainContentFocus;
	image?: {
		item: string; // ipfs://
		type: string; // "image/png"
	},
	title?: string;
	content: string;
	attachments?: [{
		item: string; // ipfs://
		type: string; // "image/png"
		cover: string; // ipfs://
	}],
	video?: {
		item: string; // "ipfs://
		type: string; // "video/mp4",
		duration: number;
	},
	embed?: string //
}

export interface Content {
	image?: string,
	content?: string,
	tags: string[],
	name: string,
	external_url: string
	lens?: ContentHeyOrOrb
}

export interface NormalizedContent {
	image?: string,
	content?: string,
	tags: string[],
	name: string,
	external_url: string
	title?: string;
}

function normalizeContent(content: Content): NormalizedContent {
	let normalizeContent = {...content}

	if (content.lens) {
		normalizeContent.content = content.lens.content
		if (content.lens.image) {
			normalizeContent.image = content.lens.image.item
		}
	}

	return normalizeContent
}

// Since v1.5.1 you're now able to call the init function for the web version without options. The current URL path will be used by default. This is recommended when running from a gateway.

const arweaveGateway = 'https://arweave.net'

export const PER_PAGE = 20

// process.env.NODE_ENV === 'development'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://lens-api.k3l.io'
// const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api'

async function resolveArLink(link: string) {
	let arLink
	if (link.indexOf('ar://') !== -1) {
		arLink = link.split('ar://')[1]
	} else {
		arLink = link
	}
	// Parse the link using the Arweave SDK
	const transaction = await fetch(arweaveGateway + '/' + arLink).then(r => r.json())
	return transaction
}

//@ts-ignore
const withRetry = async (f: Function, retries = 3) => {
	try {
		const r = await f()
		return r as any
	} catch (e) {
		retries--
		if (retries === 0) {
			throw e
		}
		return withRetry(f, retries)
	}
}

export async function getSuggestedPostsByName(name: string) {
	const results = await fetch(`${backendUrl}/suggest_posts/?handle=${name}`)
		.then((r: any) => r.json())

	return results
		//@ts-ignore
		// .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getFeedPostsByName(strategy: string, isV2: boolean, personalHandle?: string,) {
	let apiHost = backendUrl;
	if (isV2) {
		apiHost = 'https://lensv2-api.k3l.io'
	}

	if (strategy === Strategy.Personal) {
		const results = await fetch(`${apiHost}/feed/${strategy}/${personalHandle}`)
		.then((r: any) => r.json())

			return results
	}

	let url = `${apiHost}/feed/${strategy}`;
	if (strategy === Strategy.NewComer || strategy === Strategy.Spam) {
		url = `${url}?rankLimit=999999`
	}

	const results = await fetch(url)
		.then((r: any) => r.json())

	return results
		//@ts-ignore
		// .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getContent = async (contentUri: string) => {
	if (contentUri.indexOf('ar://') !== -1) {
		const content = await resolveArLink(contentUri)
		return normalizeContent(content)
	}

	const results = await withRetry(() => fetch(contentUri))
		.then((r: any) => r.json())
	// @ts-ignore

	return normalizeContent(results)
}

// https://lens-api.k3l.io/suggest_posts\?handle\=willcollier.lens


