import { useEffect, useState } from 'react'
import { getContent, NormalizedContent } from '../api/api'
import { ipfsGateway } from '../api/ipfs'
import moment from 'moment'
import Linkify from 'react-linkify';

export const Post = (props: any) => {
    const post = props.data
    // const isLast = props.isLast
    const [details, setDetails] = useState({ tags: [''] } as NormalizedContent)
    const [hideImage, setHideImage] = useState(false)

    useEffect(() => {
        const run = async () => {
            if (!post.contentUri) return
            const d = await getContent(post.contentUri)
            setDetails(d)
        }

        run()
    }, [post.contentUri])

    let image
    if (details.image && details.image.indexOf('ipfs://') !== -1) {
        const hash = details.image.split('ipfs://')[1]

        image = `${ipfsGateway}/${hash}`
    }

    if (!image && !details.content) {
        return null
    }

    const ago = moment(post.createdAt).fromNow(true)

    return <div className="post">
        <div className="post-body">
        <b><a style={{color: 'black'}} href={`https://hey.xyz/posts/${post.postId}`} target="_blank" rel="noreferrer">
            {post.handle}</a></b>
            <span style={{color: 'gray', fontWeight: 'normal', fontSize: 14}}>
                &nbsp;{ago}&nbsp;(Profile Rank: {post.rank})</span><br />
            {!hideImage && image && <div className="post-img-container">
                <img className="post-img" src={image} onError={() => setHideImage(true)} alt={details.name}/>
            </div>}
            <div className="post-desc"><Linkify>{details.content}</Linkify></div>
            <div className="post-hashtag">{details.tags && details.tags.filter(t => !!t).map(t => <span key={t}>#{t}&nbsp;</span>)}</div>
        </div>
        <div className="post-footer">
            <span>Comments:&nbsp;</span><b>{post.commentsCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>Collects:&nbsp;</span><b>{post.collectsCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* do we need to hide zero mirrors */}
            {post.mirrorsCount > -1 ? <><span>Mirrors:&nbsp;</span><b>{post.mirrorsCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</> : null}
            {post.upvotesCount > -1 ? <><span>UpVotes:&nbsp;</span><b>{post.upvotesCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</> : null}
        </div>
    </div>
}