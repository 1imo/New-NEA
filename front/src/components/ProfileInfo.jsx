// Imports
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GET_PUBLICDATA } from "../GraphQL/Queries";
import { useNavigate, useParams } from "react-router-dom";
import { FOLLOW_UNFOLLOW } from "../GraphQL/Mutations";
import Loading from "./Loading";

function ProfileInfo(props) {
	// Destucturing of props from Profile Page
	const { id } = props;

	// Accessing the Context object
	const Ctx = useContext(Context);

	// Initializing the navigate function from react-router-dom
	const navigate = useNavigate();

	// Executing the GET_PUBLICDATA query and destructuring the loading, error, and data
	const { loading, error, data } = useQuery(GET_PUBLICDATA, {
		variables: {
			username: id,
		},
	});
	// Rendering the Loading component if data is loading (commented out)
	// if (loading) return <Loading />;
	// Showing an alert if there's an error while loading the profile
	if (error) alert("Error Loading Profile");

	// Initializing the FOLLOW_UNFOLLOW mutation
	const [followUnfollow, { dataMut, errorMut, loadingMut }] =
		useMutation(FOLLOW_UNFOLLOW);

	// Function to call the FOLLOW_UNFOLLOW mutation
	async function call() {
		await followUnfollow({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				username: id,
			},
		}).then(() => window.location.reload());
	}

	// Navigating to the 404 page if there's an error
	if (error) {
		navigate("/404");
	}

	// Adding event listeners to the follow button
	useEffect(() => {
		const followBtn = document.querySelector(".followBtn");

		followBtn?.addEventListener("mousedown", (e) => {
			e.preventDefault();
		});

		followBtn?.addEventListener("touchstart", (e) => {
			e.preventDefault();
		});
	});

	return !loading ? (
		<section
			style={{
				display: "flex",
				width: "100%",
				columnGap: "16px",
				justifyContent: "space-between",
				marginBottom: 32,
				paddingTop: 16,
			}}
		>
			<div>
				{/* User information */}
				<div style={{ display: "flex", columnGap: 8 }}>
					<div>
						<h3>{data?.getPublicInfo?.name}</h3>
						<h5>@{data?.getPublicInfo?.username}</h5>
					</div>
				</div>
				{/* User stats */}
				<div style={styles.info}>
					<p style={{ fontWeight: 600 }}>
						{data?.getPublicInfo?.followerCount > 1000
							? `${data?.getPublicInfo?.followerCount / 1000}k`
							: data?.getPublicInfo?.followerCount}
						<br />
						<h5 style={{ fontWeight: 500 }}>Followers</h5>
					</p>
					<p style={{ fontWeight: 600 }}>
						{data?.getPublicInfo?.followingCount > 1000
							? `${data?.getPublicInfo?.followingCount / 1000}k`
							: data?.getPublicInfo?.followingCount}
						<br />
						<h5 style={{ fontWeight: 500 }}>Following</h5>
					</p>
					<p style={{ fontWeight: 600 }}>
						{data?.getPublicInfo?.friendCount > 1000
							? `${data?.getPublicInfo?.friendCount / 1000}k`
							: data?.getPublicInfo?.friendCount}
						<br />
						<h5 style={{ fontWeight: 500 }}>Friends</h5>
					</p>
				</div>
				{/* Follow button */}
				<button
					className="followBtn"
					style={{
						width: "100%",
						maxWidth: 240,
						height: 40,
						backgroundColor: "#ffffff",
						borderRadius: 24,
						border: "1px solid #0B0A07",
						boxShadow: "0px 2px 0px 0px #0B0A07",
						position: "relative",
						overflow: "hidden",
						userSelect: "none",
					}}
					onClick={() => call()}
					onTouchEnd={() => call()}
				>
					<span
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: "10",
							color: "#0B0A07",
							fontWeight: 600,
							fontSize: 15,
							lineHeight: 24,
							userSelect: "none",
						}}
					>
						Follow
					</span>
					<div style={styles.btnDecContainer}>
						<div style={styles.btnDec}>&nbsp;</div>
						<div style={styles.btnDec}>&nbsp;</div>
						<div style={styles.btnDec}>&nbsp;</div>
						<div style={styles.btnDec}>&nbsp;</div>
					</div>
				</button>
			</div>
			{/* User avatar */}
			<div
				style={{
					borderRadius: 800,
					backgroundColor: "#F3F3F3",
					backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${data?.getPublicInfo?.id})`,
					backgroundSize: "cover",
					height: 160,
					width: 160,
					backgroundPosition: "50% center",
				}}
			>
				&nbsp;
			</div>
		</section>
	) : (
		<Loading />
	);
}

// Defining styles
const styles = {
	info: {
		display: "flex",
		columnGap: "16px",
		margin: "16px 0px 24px",
	},
	btnDec: {
		width: 16,
		height: 80,
		background: "#F7F6F3",
		transform: "translate(-16px, -16px) rotate(45deg)",
	},
	btnDecContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		display: "flex",
		columnGap: 32,
	},
};

export default ProfileInfo;
