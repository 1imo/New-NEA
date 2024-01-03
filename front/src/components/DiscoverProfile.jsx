function DiscoverProfile(props) {
    if(!props.data?.id || !props.data?.username || !props.data?.firstName || !props.data?.lastName) {
        return
    }

    return <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <img src="/profile.jpg" height="80px" width={80} style={{borderRadius: 24, marginBottom: 8}} />
        <h5>{props.data?.firstName} {props.data?.lastName}</h5>
        <h5 style={{opacity: "50%"}}>{props?.data?.username}</h5>
    </div>
}

export default DiscoverProfile