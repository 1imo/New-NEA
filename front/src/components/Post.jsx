function Post(props) {

    // console.log(props)

    return <>
        <section style={styles.section}>
            <div>
                <img src="/shoe_collective.jpg" height="80px" width="80px" style={{"borderRadius": "40px"}}/>
            </div>
            <div style={{"paddingBottom": "8px"}}>
                <h3 style={{"textAlign": "left"}}>{props?.author?.firstName} {props?.author?.lastName}</h3>
                <h5 style={{"textAlign": "left"}}>@{props?.author?.username}</h5>
                <p style={{"textAlign": "left", "padding": "8px 0px"}}>{props.content}</p>
                <img src="/render_image.jpg" height="auto" width="100%" style={styles.imagecontent}/>
            </div>
        </section>
    </>
}

const styles = {
    section: {
        "display": "flex",
        "width": "calc(100vw - 32px)",
        "boxSizing": "border-box",
        "maxWidth": "400px",
        "columnGap": "8px"
    },
    imagecontent: {
        "borderRadius": "8px",
        "marginBottom": "8px"
    }
}
export default Post