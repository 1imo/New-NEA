import { Link, useNavigate } from "react-router-dom"
import MessageInsight from "../components/MessageInsight"

function MessageList() {

    const navigate = useNavigate()
    
    function newChat() {
        navigate("/search", { state: { searchType: "message" }});
    }

    return <>
        <nav style={{display: "flex", justifyContent: "space-between", marginBottom: 16}}>
            <h3>Messages</h3>
            <img onClick={ () => newChat() }src="/new-message.svg" />
        </nav>

        <MessageInsight />
    </>
}
export default MessageList