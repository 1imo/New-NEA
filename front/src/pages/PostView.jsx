// Import dependencies
import Nav from "../components/Nav";
import Post from "../components/Post";
import { useQuery, gql } from "@apollo/client";
import { LOAD_POST } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";

function PostView() {
	// Get the post ID from the URL parameters
	const { id } = useParams();

	// Get the context using useContext
	const Ctx = useContext(Context);

	// State for storing the post ID
	const [vars, setVars] = useState(parseInt(id));

	// Use the LOAD_POST query to fetch the post data
	const { loading, error, data } = useQuery(LOAD_POST, {
		variables: {
			id: vars,
		},
	});

	// Update the vars state whenever the id changes
	useEffect(() => {
		setVars(parseInt(id));
	}, [id]);

	// Render the component
	return (
		<>
			{/* Render the Nav component if the user is logged in */}
			{Ctx?.id && <Nav />}

			{/* Render the Post component if the post data is available, otherwise show "Post Not Found" */}
			{data?.getPost ? (
				<Post data={data?.getPost} />
			) : (
				<h4>Post Not Found</h4>
			)}
		</>
	);
}

export default PostView;
