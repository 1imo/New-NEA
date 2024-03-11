import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import io from "socket.io-client";

// Creating a new Socket.IO client instance
const socket = io("http://localhost:8000/");

// Creating a new context object
export const Context = createContext();

// Defining the ContextProvider component
export const ContextProvider = ({ children }) => {
	// State variables
	const [id, setId] = useState(Cookies.get("id"));
	const [secretkey, setSecretKey] = useState(Cookies.get("secretkey"));
	const imageServer = "http://localhost:3000";
	const [msgStore, setMsgStore] = useState([]);

	// Updating id and secretkey from cookies whenever they change
	useEffect(() => {
		setSecretKey(Cookies.get("secretkey"));
		setId(Cookies.get("id"));

		// Emitting the initialConnection event to the server with id and secretkey
		if ((id, secretkey)) {
			socket.emit("initialConnection", { id, secretkey });
		}
	}, [id, secretkey]);

	// Emitting the initialConnection event to the server whenever the socket connection changes
	useEffect(() => {
		if ((id, secretkey)) {
			socket.emit("initialConnection", { id, secretkey });
		}
	}, [socket]);

	// Handling the auth event from the server
	socket.on("auth", (data) => {
		console.log(data);
		// If authentication fails, remove id and secretkey cookies and redirect to /portal
		if (!data) {
			Cookies.remove("id");
			Cookies.remove("secretkey");
			window.location.href = "/portal";
		}
	});

	// Defining the context value object
	const contextValue = {
		id: id,
		secretkey: secretkey,
		setId,
		setSecretKey,
		socket,
		msgStore,
		setMsgStore,
		imageServer,
	};

	// Rendering the ContextProvider with the context value
	return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
