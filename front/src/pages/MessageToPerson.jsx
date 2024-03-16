// Import necessary dependencies from React and other libraries
import { useContext, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHATROOM_DATA } from "../GraphQL/Queries";
import { EDIT_MESSAGE, SEND_MESSAGE } from "../GraphQL/Mutations";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import { useInView } from "react-intersection-observer";
import Loading from "../components/Loading";

// Define the MessageToPerson component
function MessageToPerson() {
	// Get the 'id' parameter from the URL using useParams
	const { id } = useParams();

	// Use the useInView hook to detect when elements are in view
	// 'ref' is a ref that will be attached to an element to observe its visibility
	// 'inView' is a boolean indicating whether the element is currently in view
	const { ref, inView } = useInView();

	// Get the 'socket' from the context using useContext
	const { socket } = useContext(Context);

	// Get the entire context using useContext
	const Ctx = useContext(Context);

	// State variables
	// 'rerender' is a state variable used to trigger a re-render of the component
	const [rerender, setRerender] = useState(false);
	// 'recipient' is a ref to store the recipient of the messages
	const recipient = useRef();
	// 'contentRef' is a ref to store the input element for message content
	const contentRef = useRef();
	// 'msgStore' is a ref to store the array of messages
	const msgStore = useRef([]);
	// 'msgState' is a state variable that holds the current state of the messages
	// It is initialized with the current value of 'msgStore'
	const [msgState, setMsgState] = useState(msgStore.current);

	// Fetch chatroom data using Apollo's useQuery hook
	// 'loading' indicates whether the query is currently loading
	// 'error' contains any error that occurred during the query
	// 'data' contains the result of the query
	const { loading, error, data } = useQuery(GET_CHATROOM_DATA, {
		variables: {
			id: Ctx.id,
			secretkey: Ctx.secretkey,
			chatId: id,
		},
	});

	// Define mutations for sending and editing messages using Apollo's useMutation hook
	// 'sendMessage' is a function to send a message
	// 'dataMain', 'errorMain', and 'loadingMain' contain the result, error, and loading state of the mutation
	const [sendMessage, { dataMain, errorMain, loadingMain }] =
		useMutation(SEND_MESSAGE);
	// 'editMessage' is a function to edit a message
	// 'dataEdit', 'errorEdit', and 'loadingEdit' contain the result, error, and loading state of the mutation
	const [editMessage, { dataEdit, errorEdit, loadingEdit }] =
		useMutation(EDIT_MESSAGE);

	// Error handling for chatroom data loading and message editing
	if (error) alert("Error Loading Chatroom Data");
	if (errorMain) alert("Error Editing Chat");
	// Function to send a message
	async function send() {
		// Check if the message content is empty
		if (contentRef.current.value == "") return;

		// Send the message using the 'sendMessage' mutation
		sendMessage({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				content: contentRef.current.value,
				chatroom: id,
				type: "message",
			},
		});

		// Clear the input field after sending the message
		contentRef.current.value = "";
	}

	// Function to edit a message
	async function edit(type, msg) {
		// Edit the message using the 'editMessage' mutation
		const res = await editMessage({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				edit: type,
				chatroom: id,
				message: msg,
			},
		});
	}

	// UseEffect hook to handle socket events for updated chats
	useEffect(() => {
		// Function to handle updated chat data
		const handleUpdatedChat = (data) => {
			console.log("UPDATE", data);

			// Check if the last message in the 'msgStore' matches the updated chat data
			if (
				msgStore.current.length > 0 &&
				msgStore.current[msgStore.current.length - 1]?.id == data?.id
			) {
				return;
			} else {
				// Update the 'msgStore' with the new chat data
				msgStore.current = [...msgStore.current, data];
				setMsgState(msgStore.current);
			}
		};

		// Register event listeners for "chatroom" and "updatedChat" events
		socket.on("chatroom", handleUpdatedChat);
		socket.on("updatedChat", handleUpdatedChat);

		// Cleanup function to remove event listeners when the component unmounts
		return () => {
			socket.off("chatroom", handleUpdatedChat);
			socket.off("updatedChat", handleUpdatedChat);
		};
	}, []);

	// UseEffect hook to scroll to the bottom of the message container when the message store updates
	useEffect(() => {
		// Get the message container element
		const messageContainer = document.querySelector(".msgContainer");
		// Scroll to the bottom of the message container
		messageContainer.scrollTop = messageContainer.scrollHeight;
	}, [msgStore.current]);

	// UseEffect hook to mark messages as read when they come into view
	useEffect(() => {
		// Check if the last message is in view and the sender is not the current user
		if (
			inView &&
			msgStore.current[msgStore.current.length - 1]?.sender?.id !== Ctx.id
		) {
			// Mark the last message as read
			edit("read", msgStore.current[msgStore.current.length - 1].id);
		}
	}, [inView]);
	// UseEffect hook to update the message store and recipient when the chatroom data is loaded
	useEffect(() => {
		if (data?.getChatroomData?.messages) {
			// Update the 'msgStore' with the fetched messages in reverse order
			msgStore.current = data?.getChatroomData?.messages.map(
				(msg, i) =>
					data?.getChatroomData?.messages[
						data?.getChatroomData?.messages.length - 1 - i
					]
			);

			// Update the 'recipient' with the chatroom user who is not the current user
			recipient.current = data?.getChatroomData?.chatroomUsers.find(
				(us) => us.id !== Ctx.id && us.name
			);

			// Update the 'msgState' with the current 'msgStore'
			setMsgState(msgStore.current);
			console.log(data?.getChatroomData?.messages);
		}
	}, [loading]);

	// DateEl component to display the date between messages
	function DateEl({ msg, msgTwo }) {
		// Calculate the time difference between the two messages in minutes
		const difference = (msgTwo.date - msg.date) / (100 * 60);

		// Create Date objects for the two messages
		const date1 = new Date(parseInt(msg.date));
		const date2 = new Date(parseInt(msgTwo.date));

		// Check if the time difference is greater than 24 hours or if the messages are from different days
		if (difference > 24 * 60 || date1.getDay() !== date2.getDay()) {
			// Create a Date object for the current message
			const date = new Date(parseInt(msg.date));
			// Create a Date object for the current time
			const current = new Date(Date.now());

			// Arrays for day and month names
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			const months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];

			// Determine the day name based on the time difference
			const day =
				Math.abs(current - date) > 24 * 60 * 1000
					? days[date.getDay()]
					: "";

			// Determine the date based on the time difference
			const dte =
				Math.abs(current - date) > 24 * 7 * 60 * 1000
					? date.getDate()
					: "";

			// Determine the month name based on the current month and message month
			const month =
				date.getMonth == current.getMonth
					? ""
					: months[date.getMonth()];

			// Extract hours and minutes from the message date
			const hours = date.getHours();
			const minutes = date.getMinutes();
			const time = hours + ":" + minutes;

			// Construct the date string
			const dateStr = day + " " + dte + " " + month + " " + time;

			// Render the date element
			return (
				<p
					style={{
						textAlign: "center",
						marginTop: 16,
						marginBottom: 8,
						fontSize: 10,
						lineHeight: "16px",
						color: "#454542",
					}}
				>
					{dateStr}
				</p>
			);
		}
	}
	// Function to post an image
	function postImage() {
		// Create an input element of type "file"
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		// Trigger a click event on the input element to open the file picker
		input.click();

		// Handle the file selection
		input.onchange = async () => {
			// Get the selected file
			const file = input.files[0];
			// Create a FileReader instance
			const reader = new FileReader();
			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(file);

			// Handle the file loading
			reader.onload = async (e) => {
				// Send a message with the image type
				const res = await sendMessage({
					variables: {
						id: Ctx.id,
						secretkey: Ctx.secretkey,
						content: "You have been sent an image",
						chatroom: id,
						type: "image",
					},
				});

				// Create a Uint8Array from the loaded ArrayBuffer
				const uint8Array = new Uint8Array(e.target.result);

				// Upload the image to the server
				fetch(Ctx.imageServer + "/upload", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: res?.data?.sendMessage?.id,
						image: String(uint8Array),
						correlation: "Chat",
					}),
				}).then(() => window.location.reload());
			};
		};
	}

	// Function to send an attachment
	function sendAttatchment() {
		// Create an input element of type "file"
		const input = document.createElement("input");
		input.type = "file";

		// Trigger a click event on the input element to open the file picker
		input.click();

		// Handle the file selection
		input.onchange = async () => {
			// Get the selected file
			const file = input.files[0];
			// Create a FileReader instance
			const reader = new FileReader();
			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(file);

			// Handle the file loading
			reader.onload = async (e) => {
				// Send a message with the file name and type
				const res = await sendMessage({
					variables: {
						id: Ctx.id,
						secretkey: Ctx.secretkey,
						content: file.name,
						chatroom: id,
						type: "file",
					},
				});

				// Create a Uint8Array from the loaded ArrayBuffer
				const uint8Array = new Uint8Array(e.target.result);

				// Upload the file to the server
				fetch(Ctx.imageServer + "/upload", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: res?.data?.sendMessage?.id,
						image: String(uint8Array),
						correlation: "Chat",
					}),
				}).then(() => window.location.reload());
			};
		};
	}
	// Render the component JSX
	return (
		<>
			{/* Container for the message section */}
			<section
				style={{
					display: "flex",
					flexDirection: "column-reverse",
					height: "calc(100svh - 144px)",
					margin: "72px 0 40px",
					boxSizing: "border-box",
					overflowY: "scroll",
					overflowX: "hidden",
				}}
				className="message-container"
			>
				{/* Input container */}
				<div style={styles.input}>
					{/* Send message button */}
					<img
						onClick={() => send()}
						src="/send.svg"
						alt="Send Message"
					/>
					{/* Message input field */}
					<input
						ref={contentRef}
						type="text"
						placeholder="|Message"
					/>
					{/* Send image button */}
					<img
						src="/image.svg"
						onClick={() => postImage()}
						alt="Send Image"
					/>
					{/* Send file button */}
					<img
						onClick={() => sendAttatchment()}
						src="/attach.svg"
						alt="Send File"
					/>
				</div>

				{/* Message container */}
				<div className="msgContainer">
					{/* Render messages */}
					{msgState.length > 0 &&
						msgState.map((cont, index) => {
							if (index !== msgState.length - 1 && index !== 0) {
								if (cont.sender.id !== Ctx.id) {
									if (
										index + 1 < msgStore.current.length &&
										msgStore.current[index + 1].sender
											.id !== cont.sender.id &&
										msgStore.current[index - 1].sender
											.id !== cont.sender.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 8px 8px 4px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else if (
										index + 1 < msgStore.current.length &&
										cont.sender.id ===
											msgStore.current[index + 1].sender
												.id &&
										cont.sender.id ===
											msgStore.current[index - 1].sender
												.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 8px 8px 4px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id}) cover`,
																		height: 200,
																		width: 200,
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else if (
										index + 1 < msgStore.current.length &&
										cont.sender.id !==
											msgStore.current[index - 1].sender
												.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"16px 16px 4px 4px",
																	marginTop: 8,
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 4px 16px 16px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									}
								} else {
									if (
										index + 1 < msgStore.current.length &&
										msgStore.current[index + 1].sender
											.id !== Ctx.id &&
										msgStore.current[index - 1].sender
											.id !== Ctx.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"8px 4px 4px 8px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else if (
										index + 1 < msgStore.current.length &&
										cont.sender.id ===
											msgStore.current[index + 1].sender
												.id &&
										cont.sender.id ===
											msgStore.current[index - 1].sender
												.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"8px 4px 4px 8px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else if (
										index + 1 < msgStore.current.length &&
										cont.sender.id !==
											msgStore.current[index - 1].sender
												.id
									) {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"16px 16px 4px 4px",
																	marginTop: 8,
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									} else {
										return (
											<>
												{/* Render date element */}
												<DateEl
													msg={cont}
													msgTwo={
														msgStore.current[
															index - 1
														]
													}
												/>
												{/* Render message */}
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 4px 16px 16px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											</>
										);
									}
								}
							} else {
								if (index === 0) {
									if (cont.sender.id !== Ctx.id) {
										if (
											index + 1 <
												msgStore.current.length &&
											msgStore.current[index + 1].sender
												.id !== cont.sender.id
										) {
											return (
												<>
													{/* Render date element */}
													<DateEl
														msg={cont}
														msgTwo={
															msgStore.current[
																index + 1
															]
														}
													/>
													{/* Render message */}
													<div
														key={index}
														style={{
															width: "100%",
															display: "flex",
															justifyContent:
																"flex-start",
														}}
													>
														<div>
															<p
																style={{
																	...styles.msg,
																	...{
																		borderRadius:
																			"8px 4px 4px 8px",
																	},
																}}
															>
																{cont?.type ===
																"message" ? (
																	cont?.content
																) : (
																	<div
																		style={{
																			backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																			height: 200,
																			width: 200,
																			backgroundSize:
																				"cover",
																		}}
																	>
																		&nbsp;
																	</div>
																)}
															</p>
														</div>
													</div>
												</>
											);
										} else if (
											index + 1 <
												msgStore.current.length &&
											cont.sender.id ===
												msgStore.current[index + 1]
													.sender.id
										) {
											return (
												<>
													{/* Render date element */}
													<DateEl
														msg={cont}
														msgTwo={
															msgStore.current[
																index + 1
															]
														}
													/>
													{/* Render message */}
													<div
														key={index}
														style={{
															width: "100%",
															display: "flex",
															justifyContent:
																"flex-start",
														}}
													>
														<div>
															<p
																style={{
																	...styles.msg,
																	...{
																		borderRadius:
																			"16px 16px 4px 4px",
																	},
																}}
															>
																{cont?.type ===
																"message" ? (
																	cont?.content
																) : (
																	<div
																		style={{
																			backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																			height: 200,
																			width: 200,
																			backgroundSize:
																				"cover",
																		}}
																	>
																		&nbsp;
																	</div>
																)}
															</p>
														</div>
													</div>
												</>
											);
										}
									} else {
										if (
											index + 1 <
												msgStore.current.length &&
											msgStore.current[index + 1].sender
												.id !== cont.sender.id
										) {
											return (
												<>
													{/* Render date element */}
													<DateEl
														msg={cont}
														msgTwo={
															msgStore.current[
																index + 1
															]
														}
													/>
													{/* Render message */}
													<div
														key={index}
														style={{
															width: "100%",
															display: "flex",
															justifyContent:
																"flex-end",
														}}
													>
														<div>
															<p
																style={{
																	...styles.msg,
																	...{
																		borderRadius:
																			"4px 8px 8px 4px",
																	},
																}}
															>
																{cont?.type ===
																"message" ? (
																	cont?.content
																) : (
																	<div
																		style={{
																			backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																			height: 200,
																			width: 200,
																			backgroundSize:
																				"cover",
																		}}
																	>
																		&nbsp;
																	</div>
																)}
															</p>
														</div>
													</div>
												</>
											);
										} else if (
											index + 1 <
												msgStore.current.length &&
											cont.sender.id ===
												msgStore.current[index + 1]
													.sender.id
										) {
											return (
												<>
													{/* Render date element */}
													<DateEl
														msg={cont}
														msgTwo={
															msgStore.current[
																index + 1
															]
														}
													/>
													{/* Render message */}
													<div
														key={index}
														style={{
															width: "100%",
															display: "flex",
															justifyContent:
																"flex-end",
														}}
													>
														<div>
															<p
																style={{
																	...styles.msg,
																	...{
																		borderRadius:
																			"16px 16px 4px 4px",
																	},
																}}
															>
																{cont?.type ===
																"message" ? (
																	cont?.content
																) : (
																	<div
																		style={{
																			backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																			height: 200,
																			width: 200,
																			backgroundSize:
																				"cover",
																		}}
																	>
																		&nbsp;
																	</div>
																)}
															</p>
														</div>
													</div>
												</>
											);
										}
									}
								} else {
									if (cont.sender.id !== Ctx.id) {
										if (
											index - 1 <
												msgStore.current.length &&
											msgStore.current[index - 1].sender
												.id !== cont.sender.id
										) {
											return (
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															className="bottomMsg"
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 8px 8px 4px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											);
										} else if (
											index - 1 <
												msgStore.current.length &&
											cont.sender.id ===
												msgStore.current[index - 1]
													.sender.id
										) {
											return (
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-start",
													}}
												>
													<div>
														<p
															className="bottomMsg"
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"4px 8px 8px 4px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											);
										}
									} else {
										if (
											index - 1 <
												msgStore.current.length &&
											msgStore.current[index - 1].sender
												.id !== cont.sender.id
										) {
											return (
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															className="bottomMsg"
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"8px 4px 4px 8px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											);
										} else if (
											index - 1 <
												msgStore.current.length &&
											cont.sender.id ===
												msgStore.current[index - 1]
													.sender.id
										) {
											return (
												<div
													key={index}
													style={{
														width: "100%",
														display: "flex",
														justifyContent:
															"flex-end",
													}}
												>
													<div>
														<p
															className="bottomMsg"
															style={{
																...styles.msg,
																...{
																	borderRadius:
																		"8px 4px 4px 8px",
																},
															}}
														>
															{cont?.type ===
															"message" ? (
																cont?.content
															) : (
																<div
																	style={{
																		backgroundImage: `url(${Ctx.imageServer}/fetch/chats/${cont?.id})`,
																		height: 200,
																		width: 200,
																		backgroundSize:
																			"cover",
																	}}
																>
																	&nbsp;
																</div>
															)}
														</p>
													</div>
												</div>
											);
										}
									}
								}
							}
						})}
				</div>

				{/* Navigation bar */}
				<nav
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						position: "fixed",
						top: 40,
						background: "#fff",
						padding: "16px 0",
						width: "100%",
					}}
				>
					{/* Recipient information */}
					<div style={{ display: "flex", columnGap: 8 }}>
						{/* Recipient avatar */}
						<img
							src="/shoe_collective.jpg"
							height="40px"
							width="40px"
							style={{ borderRadius: 80 }}
						/>
						{/* Recipient name and username */}
						<div>
							<h3>{recipient.current?.name}</h3>
							<h5>@{recipient.current?.username}</h5>
						</div>
					</div>
				</nav>
			</section>
		</>
	);
}

// Define styles object
const styles = {
	input: {
		width: "calc(100vw - 32px)",
		marginBottom: 16,
		maxWidth: 640,
		display: "flex",
		flexDirection: "row-reverse",
		columnGap: 8,
		position: "fixed",
		bottom: "0%",
		background: "#fff",
	},
	msg: {
		color: "#454542",
		padding: "8px 16px",
		background: "#f9f9f9",
		display: "inline-block",
		wordWrap: "break-wrord",
		overflowWrap: "break-word",
		width: "fit-content",
		maxWidth: "calc((100vw - 32px) / 12 * 8)",
		borderRadius: "50px",
		marginBottom: 4,
	},
	middleMsg: {
		borderRadius: "4px 8px 8px 4px",
		marginBottom: 4,
	},
	standaloneMsg: {
		borderRadius: "16px",
		marginBottom: 8,
	},
	view: {
		display: "flex",
		flexDirection: "column-reverse",
		height: "calc(100svh - 48px)",
		overflowY: "scroll",
		boxSizing: "border-box",
	},
};

// Export the MessageToPerson component as the default export
export default MessageToPerson;
