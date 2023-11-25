function Card({ title, description}: { title: string, description: string}) {
    return (
        <div className="card-about-desc">
            <div className="card-about-desc--header"/>
            <h4 className="card-about-desc--title">
                {title}
            </h4>
            <h6 className="card-about-desc--desc">
                {description}
            </h6>
        </div>
    )
}

const ALGO_DESCRIPTION = [{
    title: "Spammers and scammers",
    description: "With K3L you can start filtering profiles and the respective posts for spam. But what would have happen if you turn it upside down and and you create a feed just based on potential spam profiles? Well figure it out!",
}, {
    title: "Photography Community",
    description: "In specific applications like Orb, communities have started to appear. One of them is a photographer group, where each member holds a token that identifies them as members. We used these members as seed and ranked posts by the reputation of their profiles.",
}, {
    title: "Newcomer",
    description: "Find some trending newbies. This feed features profiles that have a relative young account but are starting to get a lot of engagement from other users.",
}]

export function About({ onClose }: { onClose: () => void }) {
    return (
        <div className="about-bg">
            <h1 className='header-text' style={{ paddingTop: '1.5rem' }}>About</h1>
            <div className="about-desc">
                These feeds are showcasing  examples how the user experience can change be defining your own algorithm.
                <br />
                The selected feeds are based on the »engagement strategy«.
            </div>
            <button type='button' className='btn-about-description'>
                <a href="https://docs.karma3labs.com/" target="_blank" rel="noreferrer" className='btn-about-about--inner' style={{color: "rgba(21, 18, 24, 0.8)"}}>
                    Read documentation
                    <img src="/images/right-arrow.svg" width="24" height="24" alt="arrow" />
                </a>
            </button>
            <div className="about-card-wrapper">
                {ALGO_DESCRIPTION.map((d) => <Card description={d.description} title={d.title} />)}
            </div>
            <button type='button' className='btn-subheader-description' onClick={onClose}>
                <div className='btn-subheader-description--inner'>Close</div>
            </button>
        </div>
    )
}