import { useContext, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { GET_CHATROOM } from "../GraphQL/Queries"
import { useParams } from "react-router-dom"
import { Context } from "../context/Context"

function MessageToPerson() {

    const { id } = useParams()

    const Ctx = useContext(Context)

    const [ contentHeight, setContentHeight ] = useState("calc(100svh)")
    const [ vars, setVars ] = useState({})

    const { loading, error, data } = useQuery(GET_CHATROOM, {
        variables: vars
    })

    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: parseInt(id)
        })
    }, [])


    const Message = (props) => {
        return <p style={{color: "#fff", padding: "8px 16px", background: "#4C9BF7", display: "inline-block", width: "fit-content", borderRadius: 24}}>{props.msg}</p>
    }

    return <>
    <section style={{height: "calc(100dvh - 136px)"}}>
        <nav style={{display: "flex", columnGap: 8, position: "fixed", background: "#fff", paddingBottom: 16}}>
            <img src="/shoe_collective.jpg" height="40px" width="40px" style={{borderRadius: 80}} />
            <div>
                <h3>Shoe Collective</h3>
                <h5>@shoecollective</h5>
            </div>
        </nav>
        <section style={{display: "flex", flexDirection: "column-reverse", height: "calc(100vh - 160px)"}}>
            <Message msg={contentHeight} />
            <Message msg={"hi"} />
            <Message msg={"no"} />
        </section>
        <div style={styles.input}>
            <img src="/send.svg" />
            <input type="text" placeholder="|Message" style={styles.inputBox} />
        </div>

    </section>
    </>
}

const styles = {
    input: {
        width: "calc(100vw - 32px)",
        display: "flex",
        flexDirection: "row-reverse",
        columnGap: 8,
        position: "fixed",
        top: "100%",
        transform: "translateY(calc(-100% - 8px)"
    }
}


export default MessageToPerson

