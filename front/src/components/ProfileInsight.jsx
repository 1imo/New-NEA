// This is a top-level view of a user's profile once searched for. Not to be confused with ProfileInfo.jsx
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { BEFRIEND_PENDING, GET_CHATROOM } from "../GraphQL/Mutations"
import { useContext } from "react"
import { Context } from "../context/Context"

function ProfileInsight(props) {

    const navigate = useNavigate()

    const [ get_chatroom, { data, error, loading } ] = useMutation(GET_CHATROOM)
    const [ befriend_pending, { dataPen, errorPen, loadingPen } ] = useMutation(BEFRIEND_PENDING)

    const Ctx = useContext(Context)

    async function call() {
        if(props.reference == "message") {
            
            const res = await get_chatroom({
                variables: {
                    id: Ctx.id,
                    secretkey: Ctx.secretkey,
                    username: props?.username
                }
            })

            console.log(res)

            if(res?.data?.getLocation?.id) {
                navigate("/messaging/id/" + res.data.getLocation.id)
            }
        } else if (props?.reference == "main") {
            navigate("/profile/" + props?.username)
        }
        
    }

    async function befriend() {
        if(props?.reference == "pending") {
            const res = await befriend_pending({
                variables: {
                    id: Ctx.id,
                    secretkey: Ctx.secretkey,
                    request: props.pendingId,
                    action: "add"
                }
            })

            console.log(res)
        }
    }

    console.log(props)
    console.log(props?.id)


    return <>
        <section style={styles.section} onClick={() => call()} onDoubleClick={() => befriend()} >
            <div>
            <div style={{borderRadius: 80, backgroundColor: "#F3F3F3", backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${props?.id})`, backgroundSize: "cover", height: 80, width: 80, backgroundPosition: "50% center"}}>&nbsp;</div>
            </div>
            <div style={{paddingTop: 8}}>
                <h3 style={{"textAlign": "left"}}>{props?.name}</h3>
                <h5 style={{"textAlign": "left"}}>@{props?.username}</h5>
            </div>
        </section>
    </>
}

const styles = {
    section: {
        "display": "flex",
        // "alignItems": "center",
        "width": "calc(100vw - 32px)",
        "boxSizing": "border-box",
        "maxWidth": "400px",
        "columnGap": "12px",
    },
    imagecontent: {
        "borderRadius": "8px",
        "marginBottom": "8px"
    }
}

export default ProfileInsight