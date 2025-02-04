// Import dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useMutation } from "@apollo/client";
import { SIGN_IN } from "../GraphQL/Mutations";
import Cookies from "js-cookie";
import Loading from "../components/Loading";

export default function SignIn() {
	// State variables
	const [username, setUsername] = useState("");
	const [pass, setPass] = useState("");
	const [position, setPosition] = useState(0);
	const [load, setLoading] = useState(false);
	const [change, setChange] = useState(false);

	// Get the navigate function from react-router-dom
	const navigate = useNavigate();

	// Mutation for signing in
	const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

	// Display an alert if there's an error signing in
	if (error) alert("Error Signing In");

	// Function to handle the sign-in process
	async function call() {
		const res = await signIn({ variables: { username, pass } });

		if (res?.data?.signIn?.secretkey && res?.data?.signIn?.id) {
			// Set cookies for secretkey and id with an expiration of 7 days
			Cookies.set("secretkey", res.data.signIn.secretkey, {
				expires: 7,
				secure: true,
				sameSite: "Strict",
			});
			Cookies.set("id", res.data.signIn.id, {
				expires: 7,
				secure: true,
				sameSite: "Strict",
			});

			// Navigate to the home page after successful sign-in
			setTimeout(
				() => window.location.assign("http://localhost:5173"),
				1000
			);
		} else {
			alert("An error has occurred");
		}
	}

	// Use useEffect to handle position changes and trigger the sign-in process
	useEffect(() => {
		switch (position) {
			case 0:
				if (username !== "") {
					setPosition(1);
					break;
				}
			case 1:
				if (pass !== "") {
					setLoading(true);
					call();
					break;
				}
		}
	}, [username, pass]);

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

	// Array of input screens
	const screens = [
		<Input
			type="text"
			placeholder="|What's your username?"
			value={setUsername}
			referer={null}
			setChange={setChange}
		/>,
		<Input
			type="password"
			placeholder="|What's your password?"
			value={setPass}
			last={username}
			referer={null}
			setChange={setChange}
		/>,
	];

	// Render the current input screen if not loading
	return <>{!load && screens[position]}</>;
}
