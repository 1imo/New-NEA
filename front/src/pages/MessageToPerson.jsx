import { useContext, useEffect, useRef, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_CHATROOM_DATA } from "../GraphQL/Queries"
import { EDIT_MESSAGE, SEND_MESSAGE } from "../GraphQL/Mutations"
import { useParams } from "react-router-dom"
import { Context } from "../context/Context"
import { useInView } from "react-intersection-observer"
import Loading from "../components/Loading";


function MessageToPerson() {
    const { id } = useParams()
    const { ref, inView } = useInView()
    const { socket } = useContext(Context)
    const Ctx = useContext(Context)
    const [ messages, setMessages ] = useState([])
    const [ vars, setVars ] = useState({})
    const [ recipient, setRecipient ] = useState({})
    const [ focus, setFocus ] = useState(false)
    
    const contentRef = useRef()
    
    const { loading, error, data } = useQuery(GET_CHATROOM_DATA, {
        variables: vars
    })
    const [ sendMessage, { dataMain, errorMain, loadingMain } ] = useMutation(SEND_MESSAGE)
    const [ editMessage, { dataEdit, errorEdit, loadingEdit } ] = useMutation(EDIT_MESSAGE)

    if(loading) return <Loading />
    if(error) alert("Error Loading Chatroom Data")
    if(errorMain) alert("Error Editing Chat")
    

    

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
    }

    async function edit(type, msg) {
        const res = await editMessage({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                edit: type,
                chatroom: id,
                message: msg
            }
        })
    }

    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: id
        })

        // I should have used a ref to store data persistently across rerenders
        Ctx.setMsgStore([])

        const handleChatroom = (data) => {
            if (data.sender.id !== Ctx.id) {
                edit("read", data.id);
            }
            Ctx.setMsgStore(prevMsgStore => [...prevMsgStore, data])
            setMessages(prevMessages => [...prevMessages, data])
        }
    
        const handleUpdatedChat = (data) => {
            setMessages(prevMessages => {
                const newArray = [...prevMessages.slice(0, prevMessages.length - 1), data];
                Ctx.setMsgStore(newArray)
                return newArray;
            })
        }
    
        socket.on('chatroom', handleChatroom)
        socket.on('updatedChat', handleUpdatedChat)
    
        return () => {
            socket.off('chatroom', handleChatroom)
            socket.off('updatedChat', handleUpdatedChat)
        }
    }, [])

    useEffect(() => {
        setVars({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            chatId: id
        })
    }, [id]) 

    useEffect(() => {
        // Scroll to bottom of message container
        const messageContainer = document.querySelector('.message-container')
        messageContainer.scrollTop = messageContainer.scrollHeight
    }, [messages])


    useEffect(() => {
        if(inView && messages[messages.length - 1]?.sender?.id !== Ctx.id) {
            edit("read", messages[messages.length - 1].id)
            setFocus(false)
        }
    }, [inView])

    useEffect(() => {
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

            <nav style={{display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, background: "#fff", padding: "16px 0"}}>
                <div style={{display: "flex", columnGap: 8}}>
                    <img src="/shoe_collective.jpg" height="40px" width="40px" style={{borderRadius: 80}} />
                    <div>
                        <h3>{recipient?.name}</h3>
                        <h5>@{recipient?.username}</h5>
                    </div>
                </div>
            </nav>
        </section>
    </>
}
const styles = {
    input: {
        width: "100%",
        maxWidth: 640,
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

