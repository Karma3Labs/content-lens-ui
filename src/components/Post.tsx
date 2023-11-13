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

    const ago = moment(post.createdAt).fromNow()

    return (
        <div className="post-wrapper">
            <div className="post">
                <div className="post-body">
                    <div className="post-profile">
                        <div className="post-profile-img">

                        </div>
                        <div className="post-profile-info">
                            <span className='post-profile-info--handle'>
                                <a style={{color: 'black'}} href={`https://lenscan.io/publication/${post.postId}`} target="_blank" rel="noreferrer">
                                    @{post.handle}
                                </a>
                            </span>
                            <div style={{ fontSize: "12px", color: '#667085' }}>
                                <span>
                                    Rank: {post.rank}
                                </span>
                                <span>
                                {` • `}
                                </span>
                                <span>
                                    {ago}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!hideImage && image && <div className="post-img-container">
                        <img className="post-img" src={image} onError={() => setHideImage(true)} alt={details.name}/>
                    </div>}
                    <div className="post-desc"><Linkify>{details.content}</Linkify></div>
                    <div className="post-hashtag">{details.tags && details.tags.filter(t => !!t).map(t => <span>#{t}&nbsp;</span>)}</div>
                </div>
                <div className="post-footer">
                    <span>Comments:&nbsp;<b>{post.commentsCount}</b></span>
                    <span>Collects:&nbsp;<b>{post.collectsCount}</b></span>
                    {/* do we need to hide zero mirrors */}
                    {post.mirrorsCount > -1 ? <><span>Mirrors:&nbsp;<b>{post.mirrorsCount}</b></span></> : null}
                    {post.upvotesCount > -1 ? <><span>UpVotes:&nbsp;<b>{post.upvotesCount}</b></span></> : null}
                </div>
            </div>
        </div>
    )
}