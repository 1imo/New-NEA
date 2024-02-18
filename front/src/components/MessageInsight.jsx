import { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "../context/Context"

function MessageInsight(props) {
    console.log(props.data)

    const Ctx = useContext(Context)

    const recipient = props?.data?.chatroomUsers?.find(chatter => chatter.id !== Ctx.id)

    if(!recipient) window.location.reload()

    const date = new Date(props?.data?.lastMessage?.date)

    const currentDate = new Date()


    const differenceInDays = Math.abs(currentDate.getDate() - date.getDate())


    const formattedDate = differenceInDays < 1 ?
    date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit' }) :
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })

    const read = props?.data?.lastMessage?.read ? {display: "none"} : null

    

    return <>
        <Link to={`id/${props?.data?.id}`}>
            <section style={{display: "flex", columnGap: 8, alignItems: "center", margin: "16px 0"}}>
                <img src="./shoe_collective.jpg" height="80px" width="80px" style={{borderRadius: 400}} />
                <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h4>{recipient?.name}</h4>
                    <div style={{...styles.unread, ...read}} aria-label={"checked" ? "unread" : null}>&nbsp;</div>
                    </div>
                    <p style={{width: "calc(100vw - 32px - 88px)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{props?.data?.lastMessage?.content || recipient?.name?.split(" ")[0] + " has started a chat w you"}</p>
                    <p style={{fontWeight: 500}}>{formattedDate != "Invalid Date" ? formattedDate : null}</p>
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