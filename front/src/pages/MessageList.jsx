import { Link, useNavigate } from "react-router-dom"
import MessageInsight from "../components/MessageInsight"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useQuery } from "@apollo/client";
import { GET_CHATS } from "../GraphQL/Queries";
import PuffLoader from "react-spinners/PuffLoader";

function MessageList() {

    const { socket } = useContext(Context)
    const Ctx = useContext(Context)

    const navigate = useNavigate()

    const [ chats, setChats ] = useState([])

    const { loading, data, error } = useQuery(GET_CHATS, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        }
    })

    useEffect(() => {
        console.log(data)
        setChats(data?.getChats)
    }, [data])

    useEffect(() => {
        console.log("CHANGE", chats)
    }, [chats])

   
    function newChat() {
        navigate("/search", { state: { searchType: "message" }});
    }

    useEffect(() => {
        // socket.emit("getChats", {
        //     id: Ctx.id,
        //     secretkey: Ctx.secretkey
        // })

        socket.on("getChats", (data) => {
            console.log(data)

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

        { !loading && ( chats?.length > 0 ? chats.map((chat, index) => {
            return <MessageInsight key={index} data={chats[chats.length - index - 1]} />
        }) : <h4 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#CECECD"}}>No Messages</h4> )}

        <PuffLoader
            cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            color="#eeeeee"
            loading={loading}
            size={160}
          />
    </>
}
export default MessageList