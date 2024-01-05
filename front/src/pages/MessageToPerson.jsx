import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_CHATROOM, GET_CHATROOM_DATA } from "../GraphQL/Queries"
import { EDIT_MESSAGE, SEND_MESSAGE } from "../GraphQL/Mutations"
import { useParams } from "react-router-dom"
import { Context } from "../context/Context"
import { useInView } from "react-intersection-observer"


function MessageToPerson() {
    const { id } = useParams()
    const { ref, inView } = useInView()
    const { socket } = useContext(Context)
    const Ctx = useContext(Context)
    const [ messages, setMessages ] = useState([])
    const [ contentHeight, setContentHeight ] = useState("calc(100svh)")
    const [ vars, setVars ] = useState({})
    const [ recipient, setRecipient ] = useState({})
    const [ focus, setFocus ] = useState(false)
    const contentRef = useRef()
    
    const { loading, error, data } = useQuery(GET_CHATROOM_DATA, {
        variables: vars
    })
    
    const [ sendMessage, { dataMain, errorMain, loadingMain } ] = useMutation(SEND_MESSAGE)
    const [ editMessage, { dataEdit, errorEdit, loadingEdit } ] = useMutation(EDIT_MESSAGE)

    

    async function send() {
        if(contentRef.current.value == "") return
        const res = await sendMessage({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                content: contentRef.current.value,
                chatroom: id
            }
        })
        contentRef.current.value = ""


        if(errorMain) console.log(errorMain)
    }

    async function edit(type, msg) {
        console.log({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            edit: type,
            chatroom: parseInt(id),
            msg
        })
        const res = await editMessage({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                edit: type,
                chatroom: parseInt(id),
                message: msg
            }
        })

        console.log(res)
    }

    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: id
        })
    }, [id])


    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: id
        })

        Ctx.setMsgStore([])


        
    }, [])
    socket.on('chatroom', (data) => {
    
        Ctx.setMsgStore([...Ctx.msgStore, data])
        setMessages([...Ctx.msgStore, data])
            
        
      })


    useEffect(() => {
        
        const messageContainer = document.querySelector('.message-container')
        messageContainer.scrollTop = messageContainer.scrollHeight
    }, [messages])


    useEffect(() => {
        if(inView && messages[messages.length - 1]?.sender?.id !== Ctx.id) {
            console.log(messages[messages.length - 1])
            edit("read", messages[messages.length - 1].id)
            setFocus(false)
        }
    }, [inView])

    useEffect(() => {
        console.log(data)
        if(data?.getChatroomData?.messages) {
            Ctx.setMsgStore(data?.getChatroomData?.messages)
            setMessages(data?.getChatroomData?.messages)
        }
        if(data?.getChatroomData?.chatters) {
            setRecipient(data?.getChatroomData?.chatters.find(us => us.id !== Ctx.id))
        }
    }, [data])

    
 return <>
        <section onFocus={() => setFocus(true)} style={{display: "flex", flexDirection: "column-reverse", height: "calc(100svh - 88px)", margin: "48px 0 40px", boxSizing: "border-box", overflowY: "scroll", overflowX: "hidden",}} className="message-container">
            <div style={styles.input}>
                <img onClick={() => send()} src="/send.svg" />
                <input ref={contentRef} type="text" placeholder="|Message" />
            </div>

            {messages ? messages.map((cont, index) => {
                return <div key={index} ref={index == 0 ? ref : null} style={ messages[messages.length - 1 - index]?.sender?.id === Ctx.id ? {width: "100%", display: "flex", justifyContent: "flex-end"} : null}><div><p style={{...styles.msg}}>{messages[messages.length - 1 - index]?.content}</p><p>{index == 0 && messages[messages.length - 1 - index]?.read && messages[messages.length - 1 - index]?.sender?.id == Ctx.id ? "Read" : null}</p></div></div>
                } ) : null}

            <nav style={{display: "flex", columnGap: 8, position: "fixed", top: 0, background: "#fff", padding: "16px 0"}}>
                <img src="/shoe_collective.jpg" height="40px" width="40px" style={{borderRadius: 80}} />
                <div>
                    <h3>{`${recipient?.name?.split(" ")[0]} ${recipient?.name?.split(" ")[0]}`}</h3>
                    <h5>@{recipient?.username}</h5>
                </div>
            </nav>
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
        bottom: "0%",
        background: "#fff"
        // transform: "translateY(calc(-100% - 8px)"
    },
    msg: {
        color: "#fff",
        padding: "8px 16px", 
        background: "#4C9BF7", 
        display: "inline-block",
        borderRadius: 24,
        marginTop: 8,
        wordWrap: "break-wrord",
        overflowWrap: "break-word",
        width: "fit-content"
    },
    view: {
        display: "flex", 
        flexDirection: "column-reverse", 
        height: "calc(100svh - 48px)",
        overflowY: "scroll",
        boxSizing: "border-box"
    }
}


export default MessageToPerson

