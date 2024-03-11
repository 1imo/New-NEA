// Importing components
import Nav from "../components/Nav";
import Post from "../components/Post";
import DiscoverProfile from "../components/DiscoverProfile";
import Loading from "../components/Loading";

// Importing hooks and utilities
import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeClientSetsFromDocument } from "@apollo/client/utilities";

// Importing context and queries
import { Context } from "../context/Context";
import { GET_FEED } from "../GraphQL/Queries";

// Importing Cookies library
import Cookies from "js-cookie";

function Home() {
	// Accessing the Context object
	const Ctx = useContext(Context);

	// State variables
	const [vars, setVars] = useState(Cookies.get("feed"));
	const [load, setLoading] = useState(true);

	// Initializing the navigate function
	const navigate = useNavigate("/");

	// Executing the GET_FEED query
	const { error, loading, data } = useQuery(GET_FEED, {
		variables: {
			id: Ctx.id,
			secretkey: Ctx.secretkey,
			type: vars || "Recommended",
		},
	});

	// Setting cookies for user ID and secret key from URL parameters when the component mounts
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const user = urlParams.get("u");
		const key = urlParams.get("k");

		if (user && key) {
			Cookies.set("id", user);
			Cookies.set("secretkey", key);
		}
	}, []);

	// Showing an alert if there's an error loading the feed
	if (error) alert("Error Loading Feed");

	// Rendering the Loading component if the data is still loading
	if (loading) return <Loading />;

	// Defining the Feed component
	const Feed = () => {
		return data?.getFeed?.length > 0 ? (
			data?.getFeed?.map((da, index) => {
				// Rendering the Post component for each post
				if (index != 2) {
					return <Post data={da} key={da.id || index} />;
				} else {
					// After the third post, rendering the DiscoverProfile component
					return (
						<>
							<Post data={da} key={da.id || index} />
							<DiscoverProfile />
						</>
					);
				}
			})
		) : (
			<div
				style={{
					position: "absolute",
					textAlign: "center",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				{/* If no posts are available, showing a message and the DiscoverProfile component with animation */}
				<h4 style={{ color: "#CECECD" }}>Go Follow Someone Active</h4>
				<DiscoverProfile animation={true} />
			</div>
		);
	};

	return (
		<>
			{/* Rendering the Nav component with icons and setting the loading state */}
			<Nav
				icons={true}
				load={setLoading}
				style={load ? { opacity: 0 } : null}
			/>
			{/* Rendering the Feed component within a container */}
			{!load && (
				<div
					style={{
						boxSizing: "border-box",
						width: "100%",
						maxWidth: 640,
						overflowX: "hidden",
					}}
				>
					<Feed />
				</div>
			)}
		</>
	);
}

export default Home;
