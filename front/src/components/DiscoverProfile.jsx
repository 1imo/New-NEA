// Imports
import { useQuery } from "@apollo/client";
import { DISCOVER_PEOPLE } from "../GraphQL/Queries";
import { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
// import init, { Queue } from "../../public/pkg/web_module";
import Loading from "./Loading";

function DiscoverProfile(props) {
	// State and hook initialization
	const [vars, setVars] = useState([]);
	const Ctx = useContext(Context);
	const navigate = useNavigate("/");
	const queue = useRef(null);
	const removeX = useRef(0);

	// Executing the DISCOVER_PEOPLE query and destructuring the loading, data, and err values from the result
	const { loading, data, err } = useQuery(DISCOVER_PEOPLE, {
		variables: {
			id: Ctx.id,
			secretkey: Ctx.secretkey,
		},
		fetchPolicy: "cache-first",
	});

	// Rendering the Loading component if data is loading, or showing an alert if there's an error
	// if (loading) return <Loading />;
	if (err) alert("Error Loading Recommended Users");

	// Using the useEffect hook to set the vars state with the parsed value from the sessionStorage when the component mounts
	useEffect(() => {
		setVars(JSON.parse(sessionStorage.getItem("recommendedUsers")));
	}, []);

	// Using the useEffect hook to update the vars state with the mapped recommendedUsers data from the fetched data
	useEffect(() => {
		setVars(
			data?.recommendedUsers.map((user) => {
				JSON.stringify(user);
			})
		);
	}, [data]);

	// Using the useEffect hook to initialize the Queue instance and set up the animation interval
	useEffect(() => {
		// init().then((module) => {
		// 	queue.current = Queue.new(10);
		// 	data?.recommendedUsers.map((user) => {
		// 		queue.current.enqueue(JSON.stringify(user));
		// 	});
		// 	let count = 0;
		// 	const animationInterval = setInterval(() => {
		// 		removeX.current = removeX.current + 1;
		// 		count += 1;
		// 		if (count == 96) {
		// 			queue.current.enqueue(queue.current.dequeue());
		// 			count -= 96;
		// 			removeX.current = 0;
		// 		}
		// 	}, 40);
		// 	return () => {
		// 		clearInterval(animationInterval);
		// 	};
		// });
	}, [vars]);

	// Defining styles for the user card component
	const styles = {
		card: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: 8,
			padding: "24px 0 32px",
			cursor: "pointer",
			textAlign: "center",
			transform: `translateX(-${removeX.current}px)`,
			transition: "transform 0.5s ease defer",
		},
	};

	// Defining a nested functional component called Profile to render an individual user card
	function Profile(props) {
		const { user } = props;
		return (
			<div
				style={styles.card}
				onTouchStart={() => navigate(`/profile/${user.username}`)}
				onMouseDown={() => navigate(`/profile/${user.username}`)}
				className="carousel"
			>
				<div
					style={{
						borderRadius: 800,
						backgroundColor: "#F3F3F3",
						backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${user.id})`,
						backgroundSize: "cover",
						height: 80,
						width: 80,
						backgroundPosition: "50% center",
					}}
				>
					&nbsp;
				</div>
				<h5 style={{ marginTop: 4 }}>{user?.name.split(" ")[0]}</h5>
				<h5 style={{ opacity: "50%" }}>{user.username}</h5>
			</div>
		);
	}

	// Rendering the DiscoverProfile component
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				columnGap: 16,
				width: "100%",
				maxWidth: 640,
				overflowX: "hidden",
			}}
		>
			{queue?.current?.get_current_items()?.map((user, i) => {
				return <Profile key={i} user={JSON.parse(user)} />;
			})}
		</div>
	);
}

// Exporting the DiscoverProfile component as the default export
export default DiscoverProfile;
