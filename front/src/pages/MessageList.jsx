// Imports
import { useNavigate } from "react-router-dom";
import MessageInsight from "../components/MessageInsight";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useQuery } from "@apollo/client";
import { GET_CHATS } from "../GraphQL/Queries";
import Loading from "../components/Loading";
import { useInView } from "react-intersection-observer";

function MessageList() {
	// Accessing the Context object
	const Ctx = useContext(Context);

	// Initializing the navigate function
	const navigate = useNavigate();

	// State to store chats
	const [chats, setChats] = useState([]);

	// Intersection Observer for messages
	const [ref, inView] = useInView();

	// Executing the GET_CHATS query
	const { loading, data, error } = useQuery(GET_CHATS, {
		variables: {
			id: Ctx.id,
			secretkey: Ctx.secretkey,
		},
	});

	// Showing an alert if there's an error loading chats
	if (error) alert("Error Loading Chats");

	// Updating the chats state when data changes
	useEffect(() => {
		setChats(data?.getChats);
	}, [data]);

	// Function to navigate to the search page for creating a new chat
	function newChat() {
		navigate("/search", { state: { searchType: "message" } });
	}

	// Handling Socket.IO events
	useEffect(() => {
		// Listen for "getChats" event
		const getChatsListener = (data) => {
			setChats(data);
		};

		// Listen for "updatedChat" event
		const updatedChatListener = (data) => {
			Ctx.socket.emit("getChats", {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
			});
		};

		// Add event listeners
		Ctx.socket.on("getChats", getChatsListener);
		Ctx.socket.on("updatedChat", updatedChatListener);

		// Cleanup function
		return () => {
			// Remove event listeners
			Ctx.socket.off("getChats", getChatsListener);
			Ctx.socket.off("updatedChat", updatedChatListener);
		};
	}, []);

	return !loading ? (
		<div
			onFocusCapture={() =>
				setTimeout(() => window.location.reload(), 250)
			}
		>
			{/* Navigation bar */}
			<nav
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 16,
					marginTop: 32,
				}}
			>
				<h3>Messages</h3>
				<img onClick={() => newChat()} src="/new-message.svg" />
			</nav>

			{/* Rendering chats or a message if no chats are available */}

			{chats?.length > 0 ? (
				chats.map((chat, index) => {
					return (
						<MessageInsight
							key={index}
							data={chats[chats.length - index - 1]}
						/>
					);
				})
			) : (
				<h4
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						color: "#CECECD",
					}}
				>
					No Messages
				</h4>
			)}
		</div>
	) : (
		<Loading />
	);
}

export default MessageList;
