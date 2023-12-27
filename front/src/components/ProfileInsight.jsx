// This is a top-level view of a user's profile once searched for. Not to be confused with ProfileInfo.jsx

function ProfileInsight(props) {
    return <>
        <section style={styles.section}>
            <div>
                <img src="/shoe_collective.jpg" height="80px" width="80px" style={{"borderRadius": "40px"}}/>
            </div>
            <div>
                <h3 style={{"textAlign": "left"}}>{props?.firstName} {props?.lastName}</h3>
                <h5 style={{"textAlign": "left"}}>@{props?.username}</h5>
            </div>
        </section>
    </>
}

const styles = {
    section: {
        "display": "flex",
        "align-items": "center",
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

export default ProfileInsight