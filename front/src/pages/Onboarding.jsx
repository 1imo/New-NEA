// Import necessary dependencies from react, apollo/client, js-cookie, and react-router-dom
import { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import { CREATE_USER_MUTATION } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Loading from "../components/Loading";

function Onboarding() {
	// Get the context using useContext
	const Ctx = useContext(Context);

	// Declare state variables using useState
	const [fn, setFn] = useState("");
	const [ln, setLn] = useState("");
	const [username, setUsername] = useState("");
	const [pass, setPass] = useState("");
	const [profile, setProfile] = useState("");
	const [position, setPosition] = useState(0);
	const [load, setLoading] = useState(false);
	const [change, setChange] = useState(false);

	// Use useMutation to create a user mutation
	const [createUser, { data, error, loading }] =
		useMutation(CREATE_USER_MUTATION);

	// Handle error and loading states
	// if(loading) return <Loading />
	if (error) alert("Error Creating Profile");

	// Get the navigate function from useNavigate
	const navigate = useNavigate();

	// Define an async function to create a user
	async function call() {
		setLoading(true);

		// Call the createUser mutation with the provided variables
		const res = await createUser({
			variables: {
				firstName: fn,
				lastName: ln,
				username: username,
				password: pass,
			},
		});

		console.log(res);

		// If the user creation is successful
		if (res.data.createUser.secretkey && res.data.createUser.id) {
			// Set cookies for secretkey and id with an expiration of 7 days
			Cookies.set("secretkey", res.data.createUser.secretkey, {
				expires: 7,
				secure: true,
				sameSite: "Strict",
			});
			Cookies.set("id", res.data.createUser.id, {
				expires: 7,
				secure: true,
				sameSite: "Strict",
			});

			// If a profile image is provided
			if (profile) {
				// Upload the profile image to the image server
				await fetch(Ctx.imageServer + "/upload", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: res.data.createUser.id,
						image: String(profile),
						correlation: "Profile",
					}),
				});
			}

			// Navigate to the home page after storing cookies
			setTimeout(
				() => window.location.assign("http://localhost:5173"),
				1000
			);
		} else {
			// If an error occurs, show an alert and redirect to the onboarding page
			alert("Error Occurred");
			window.location.href = "/onboarding";
		}
	}

	// Use useEffect to handle position changes and trigger the call function
	useEffect(() => {
		switch (position) {
			case 0:
				if (fn !== "") {
					setPosition(1);
					break;
				}
			case 1:
				if (ln !== "") {
					setPosition(2);
					break;
				}
			case 2:
				if (username !== "") {
					setPosition(3);
					break;
				}
			case 3:
				if (pass !== "") {
					setPosition(4);
					break;
				}
			case 4:
				if (profile !== "") {
					call();
					break;
				}
		}
	}, [fn, ln, username, pass, profile]);

	// Navigate backwards in the flow
	useEffect(() => {
		if (change) {
			setChange(false);
			if (position != 0) {
				setPosition((prev) => prev - 1);
			} else {
				navigate("/portal");
			}
		}
	}, [change]);

	// Define an array of screens with input components
	const screens = [
		<Input
			type="text"
			placeholder="|What's Your Name?"
			value={setFn}
			referer="/portal"
		/>,
		<Input
			type="text"
			placeholder="|What's Your Last Name?"
			value={setLn}
			last={fn}
			referer={null}
			setChange={setChange}
		/>,
		<Input
			type="text"
			placeholder="|What Will Your Username Be?"
			value={setUsername}
			last={ln}
			referer={null}
			setChange={setChange}
		/>,
		<Input
			type="password"
			placeholder="|Choose a Good Password"
			value={setPass}
			last={username}
			referer={null}
			setChange={setChange}
		/>,
		<Input
			type="file"
			value={setProfile}
			last={pass}
			referer={null}
			setChange={setChange}
		/>,
	];

	// Render the current screen based on the position state if not loading
	return <>{!load ? screens[position] : <Loading />}</>;
}

export default Onboarding;
