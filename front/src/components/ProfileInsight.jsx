// Imports
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { BEFRIEND_PENDING, GET_CHATROOM } from "../GraphQL/Mutations";
import { useContext } from "react";
import { Context } from "../context/Context";

function ProfileInsight(props) {
	// Initializing the navigate function from react-router-dom
	const navigate = useNavigate();

	// Initializing the GET_CHATROOM mutation
	const [get_chatroom, { data, error, loading }] = useMutation(GET_CHATROOM);

	// Initializing the BEFRIEND_PENDING mutation
	const [befriend_pending, { dataPen, errorPen, loadingPen }] =
		useMutation(BEFRIEND_PENDING);

	// Accessing the Context object
	const Ctx = useContext(Context);

	// Function to handle navigation or retrieve chatroom
	async function call() {
		if (props.reference == "message") {
			// Retrieving the chatroom location
			const res = await get_chatroom({
				variables: {
					id: Ctx.id,
					secretkey: Ctx.secretkey,
					username: props?.username,
				},
			});

			console.log(res);

			if (res?.data?.getLocation?.id) {
				// Navigating to the chatroom
				navigate("/messaging/id/" + res.data.getLocation.id);
			}
		} else if (props?.reference == "main") {
			// Navigating to the user's profile
			navigate("/profile/" + props?.username);
		}
	}

	// Function to handle friend request
	async function befriend() {
		if (props?.reference == "pending") {
			// Sending a friend request
			const res = await befriend_pending({
				variables: {
					id: Ctx.id,
					secretkey: Ctx.secretkey,
					request: props.pendingId,
					action: "add",
				},
			});

			console.log(res);
		}
	}

	console.log(props);
	console.log(props?.id);

	return (
		<>
			<div
				style={styles.section}
				onClick={() => call()}
				onDoubleClick={() => befriend()}
			>
				<div>
					<div
						style={{
							borderRadius: 80,
							backgroundColor: "#F3F3F3",
							backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${props?.id})`,
							backgroundSize: "cover",
							height: 80,
							width: 80,
							backgroundPosition: "50% center",
						}}
					>
						&nbsp;
					</div>
				</div>
				<div style={{ paddingTop: 8 }}>
					<h3 style={{ textAlign: "left" }}>{props?.name}</h3>
					<h5 style={{ textAlign: "left" }}>@{props?.username}</h5>
				</div>
			</div>
		</>
	);
}

// Defining styles
const styles = {
	section: {
		display: "flex",
		width: "calc(100vw - 32px)",
		boxSizing: "border-box",
		maxWidth: "400px",
		columnGap: "12px",
	},
	imagecontent: {
		borderRadius: "8px",
		marginBottom: "8px",
	},
};

export default ProfileInsight;
