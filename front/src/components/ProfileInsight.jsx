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
            console.log("MESSAGE")
            console.log({id: Ctx.id,
                secretkey: Ctx.secretkey,
                username: props?.username})
            const res = await get_chatroom({
                variables: {
                    id: Ctx.id,
                    secretkey: Ctx.secretkey,
                    username: props?.username
                }
            })


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
                    request: props?.id,
                    action: "add"
                }
            })

            console.log(res)
        }
    }


    return <>
        <section style={styles.section} onClick={() => call()} onDoubleClick={() => befriend()}>
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
        "alignItems": "center",
        "width": "calc(100vw - 32px)",
        "boxSizing": "border-box",
        "maxWidth": "400px",
        "columnGap": "8px",
    },
    imagecontent: {
        "borderRadius": "8px",
        "marginBottom": "8px"
    }
}

export default ProfileInsight