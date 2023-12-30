import { useContext, useEffect, useRef, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_CHATROOM } from "../GraphQL/Queries"
import { SEND_MESSAGE } from "../GraphQL/Mutations"
import { useParams } from "react-router-dom"
import { Context } from "../context/Context"
import io from 'socket.io-client';

const socket = io('http://localhost:8000/');

function MessageToPerson() {

    
    const joinRoom = (roomId) => {
        socket.emit('joinRoom', roomId);
        console.log(roomId, "ROOM")
    }

    // console.log(socket)
    
    const { id } = useParams()
    

    const Ctx = useContext(Context)

    const [ contentHeight, setContentHeight ] = useState("calc(100svh)")
    const [ vars, setVars ] = useState({})
    const [ messages, setMessages ] = useState([])
    const contentRef = useRef()

    const { loading, error, data } = useQuery(GET_CHATROOM, {
        variables: vars
    })

    

    

    const [ sendMessage, { dataMain, errorMain, loadingMain } ] = useMutation(SEND_MESSAGE)

    async function send() {
        // console.log("SEND")
        const res = await sendMessage({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                content: contentRef.current.value,
                chatroom: parseInt(id)
            }
        })


        console.log(res)
        if(errorMain) console.log(errorMain)
    }


    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: parseInt(id)
        })

        joinRoom(parseInt(id))

        socket.on('chatroom', (data) => {
            // console.log(data, "PING")
            if(data?.messages) {
                const reverse = data.messages.reverse()
                // console.log(reverse)
                setMessages(reverse)
            }

          });
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
            {messages ? messages.map((cont, index) => <Message msg={cont.content} key={index} /> ) : null}
        </section>
        <div style={styles.input}>
            <img onClick={() => send()} src="/send.svg" />
            <input ref={contentRef} type="text" placeholder="|Message" style={styles.inputBox} />
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

