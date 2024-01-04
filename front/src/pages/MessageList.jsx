import { Link, useNavigate } from "react-router-dom"
import MessageInsight from "../components/MessageInsight"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";

function MessageList() {

    const { socket } = useContext(Context)
    const Ctx = useContext(Context)

    const navigate = useNavigate()

    const [ chats, setChats ] = useState([])
    
    function newChat() {
        navigate("/search", { state: { searchType: "message" }});
    }

    useEffect(() => {
        socket.emit("getChats", {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        })

        socket.on("getChats", (data) => {
            // console.log(data)

            setChats(data)
            
        })

        socket.on("updatedChat", (data) => {
            socket.emit("getChats", {
                id: Ctx.id,
                secretkey: Ctx.secretkey
            })
        })

    
    }, [])

    return <>
        <nav style={{display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop: 32}}>
            <h3>Messages</h3>
            <img onClick={ () => newChat() }src="/new-message.svg" />
        </nav>

        { chats ? chats.map((chat, index) => {
            // console.log(chat, index)
            return <MessageInsight key={index} data={chats[chats.length - 1 - index]} />
        }) : null }
    </>
}
export default MessageList