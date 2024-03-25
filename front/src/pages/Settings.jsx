// Import dependencies
import { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Context } from "../context/Context";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PENDING_REQUESTS } from "../GraphQL/Queries";
import { BEFRIEND_PENDING, EDIT_DATA } from "../GraphQL/Mutations";
import ProfileInsight from "../components/ProfileInsight";
import Cookies from "js-cookie";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function Settings() {
	// Get the socket and context from the Context
	const { socket } = useContext(Context);
	const Ctx = useContext(Context);

	// State variables
	const [optn, setOptn] = useState(0);
	const [value, setValue] = useState(null);
	const [view, setView] = useState(0);
	const [picked, setPicked] = useState("");
	const [placeholder, setPlaceholder] = useState("");
	const [render, setRender] = useState([]);

	// Get the navigate function from react-router-dom
	const navigate = useNavigate();

	// Array of feed options
	const feedOptns = ["Recommended", "Date", "Friends", "Following"];

	// Query to get pending requests
	const { data, err, loading } = useQuery(GET_PENDING_REQUESTS, {
		variables: {
			id: Ctx.id,
			secretkey: Ctx.secretkey,
		},
	});

	// Handle error
	if (err) alert("Error Loading Pending Requests");

	// Update the render state when data changes
	useEffect(() => {
		setRender(data?.getPending);
	}, [data]);

	// Mutation to edit user data
	const [createEdit, { d, e, l }] = useMutation(EDIT_DATA);

	// Function to change the feed option
	function changeFeed() {
		if (optn !== feedOptns.length - 1) {
			setOptn(optn + 1);
			Cookies.set("feed", feedOptns[optn + 1]);
		} else {
			setOptn(0);
			Cookies.set("feed", feedOptns[0]);
		}
	}

	// Set up socket event listeners and initialize feed option
	useEffect(() => {
		const followedHandler = (da) => {
			if (!render.length || render[0].id !== da?.follower?.id) {
				const f = da?.follower;
				const format = {
					pendingId: da?.id,
					...f,
				};
				setRender([format, ...render]);
			}
		};

		socket.on("followed", followedHandler);

		const original = Cookies.get("feed");
		const index = feedOptns.findIndex((op) => op === original);
		setOptn(index || 0);

		return () => {
			socket.off("followed", followedHandler);
		};
	}, []);

	// Array of content views
	let content = [
		<>
			<Nav icons={true} />

			{render && (
				<section
					style={{
						marginBottom: 24,
						display: "flex",
						flexDirection: "column",
						rowGap: 16,
					}}
				>
					<h4>Pending</h4>
					{render?.map((info, index) => {
						return (
							<ProfileInsight
								reference={"pending"}
								key={index}
								name={info.name}
								username={info.username}
								pendingId={info?.pendingId}
								id={info?.id}
							/>
						);
					})}
				</section>
			)}
			<section>
				<h4 style={{ marginBottom: 16 }}>Settings</h4>
				<p style={{ marginBottom: 8 }} onClick={() => changeFeed()}>
					Tap to change feed: {feedOptns[optn]}
				</p>
				<p
					style={{ marginBottom: 8 }}
					onClick={() => edit("New Name..", "name")}
				>
					Change Name
				</p>
				<p
					style={{ marginBottom: 8 }}
					onClick={() => edit("New Username..", "username")}
				>
					Change Username
				</p>
				<p
					style={{ marginBottom: 8 }}
					onClick={() => edit("New Password..", "password")}
				>
					Change Password
				</p>
				<p style={{ marginBottom: 8 }} onClick={() => logout()}>
					Log Out
				</p>
			</section>
		</>,
		<Input
			type={picked !== "password" ? "text" : "password"}
			placeholder={placeholder}
			value={setValue}
			referer="/settings"
		/>,
	];

	// Function to edit user data
	function edit(placeholder, type) {
		setPlaceholder(placeholder);
		setPicked(type);
		setView(1);
	}

	// Function to log out the user
	function logout() {
		Cookies.remove("id");
		Cookies.remove("secretkey");
		navigate("/portal");
	}

	// Function to make the edit mutation
	async function around() {
		let res = await createEdit({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				request: picked,
				data: value,
			},
		});

		if (res?.data?.editDetails?.secretkey) {
			Cookies.set("secretkey", res?.data?.editDetails?.secretkey, {
				expires: 7,
			});
		}

		return res;
	}

	// Update the view and make the edit mutation when value changes
	useEffect(() => {
		if (value) {
			around();
			setView(0);
		}
	}, [value]);

	// Render the current content view
	return content[view];
}

export default Settings;
