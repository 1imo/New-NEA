import { useNavigate } from "react-router-dom"
import MessageInsight from "../components/MessageInsight"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useQuery } from "@apollo/client";
import { GET_CHATS } from "../GraphQL/Queries";
// import PuffLoader from "react-spinners/PuffLoader";
import Loading from "../components/Loading";

function MessageList() {
    const Ctx = useContext(Context)
    const navigate = useNavigate()
    const [ chats, setChats ] = useState([])

    const { loading, data, error } = useQuery(GET_CHATS, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        }
    })

    if(error) alert("Error Loading Chats")
    if(loading) return <Loading />

    useEffect(() => {
        setChats(data?.getChats)
    }, [data])
  
    function newChat() {
        navigate("/search", { state: { searchType: "message" }});
    }

    useEffect(() => {
        // Listen for "getChats" event
        const getChatsListener = (data) => {
            setChats(data)
        }
    
        // Listen for "updatedChat" event
        const updatedChatListener = (data) => {
            Ctx.socket.emit("getChats", {
                id: Ctx.id,
                secretkey: Ctx.secretkey
            })
        }
    
        // Add event listeners
        Ctx.socket.on("getChats", getChatsListener)
        Ctx.socket.on("updatedChat", updatedChatListener)
    
        // Cleanup function
        return () => {
            // Remove event listeners
            Ctx.socket.off("getChats", getChatsListener)
            Ctx.socket.off("updatedChat", updatedChatListener)
        }
    }, [])


    return <>
        <nav style={{display: "flex", justifyContent: "space-between", marginBottom: 16, marginTop: 32}}>
            <h3>Messages</h3>
            <img onClick={ () => newChat() }src="/new-message.svg" />
        </nav>

        { !loading && ( chats?.length > 0 ? chats.map((chat, index) => {
            return <MessageInsight key={index} data={chats[chats.length - index - 1]} />
        }) : <h4 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#CECECD"}}>No Messages</h4> )}
    </>
}
export default MessageList