import { Link } from "react-router-dom"

function MessageInsight() {
    return <>
        <Link to="id/1">
            <section style={{display: "flex", columnGap: 8, alignItems: "center", margin: "16px 0"}}>
                <img src="./shoe_collective.jpg" height="80px" width="80px" style={{borderRadius: 400}} />
                <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h4>Shoe Collective</h4>
                        <div style={styles.unread} aria-label={"checked" ? "unread" : null}>&nbsp;</div>
                    </div>
                    <p style={{width: "calc(100vw - 32px - 88px)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>is friday wet? or is does this js not make any sense at all. lorem would fill this space up maybe but idc cah it works</p>
                    <p style={{fontWeight: 500}}>21:18</p>
                </div>
            </section>
        </Link>
    </>
}

const styles = {
    unread: {
        boxSizing: "border-box",
        height: 16,
        width: 16,
        background: "#4C9BF7",
        borderRadius: 32
    }
}

export default MessageInsight