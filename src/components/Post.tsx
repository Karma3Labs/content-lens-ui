import { useEffect, useState } from 'react'
import { getContent, Content } from '../api/api'
import { ipfsGateway } from '../api/ipfs'
import moment from 'moment'

export const Post = (props: any) => {
    const post = props.data
    const isLast = props.isLast
    const [details, setDetails] = useState({ tags: [''] } as Content)
    const [hideImage, setHideImage] = useState(false)

    useEffect(() => {
        const run = async () => {
            console.log(post.contentUri)
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

    return <div className='post-component'>

        <div className="post-desc post-body">
        <b><a style={{color: 'black'}} href={details.external_url} target="_blank" rel="noreferrer">{details.name}</a></b>&nbsp;{ago}<br />
            

            {!hideImage && image && <>
                <img className="main-img" src={image} onError={() => setHideImage(true)} alt={details.name}/>
            </>}

            {details.content}<br />
            {details.tags && details.tags.filter(t => !!t).map(t => <>#{t}&nbsp;</>)}<br />


        </div>
        <div style={{ textAlign: 'left', padding: 20, fontSize: 13 }}>
            <span>Comments:&nbsp;</span><b>{post.commentsCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <span>Collects:&nbsp;</span><b>{post.collectsCount}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <span>Mirrors:&nbsp;</span><b>{post.mirrorsCount}</b>&nbsp;
        </div>
        {!isLast && <div className="post-desc separator" ></div>}
    </div>
}