// Import dependencies
import { GET_USERPOSTS } from "../GraphQL/Queries";
import Loading from "../components/Loading";
import Post from "../components/Post";
import ProfileInfo from "../components/ProfileInfo";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
	// Get the username from the URL parameters
	const { id } = useParams();

	// State for storing the username
	const [d, setD] = useState("");

	// State for storing the reversed posts
	const [reversed, setReversed] = useState([]);

	// Use the GET_USERPOSTS query to fetch the user's posts
	const { loading, error, data } = useQuery(GET_USERPOSTS, {
		variables: {
			username: d,
		},
	});

	// Handle error
	if (error) alert("Error Loading Profile");

	// Update the username state whenever the id changes
	useEffect(() => {
		setD(id);
	}, [id]);

	// Update the reversed posts state whenever the data changes
	useEffect(() => {
		if (data?.getAllPosts) {
			const posts = data?.getAllPosts.map((vals, index) => {
				return <Post data={vals} key={index} />;
			});
			setReversed(posts.reverse());
		}
	}, [data]);

	// Render the component
	return (
		<>
			{/* Render the ProfileInfo component */}
			<ProfileInfo />

			{/* Render the reversed posts if there are any, otherwise show "No Posts to Display" */}
			{reversed?.length > 0 ? (
				reversed?.map((vals, index) => {
					console.log("VALS", vals);
					return vals;
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
					No Posts to Display
				</h4>
			)}
		</>
	);
}

export default Profile;
