import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GET_PUBLICDATA } from "../GraphQL/Queries";
import { useNavigate, useParams } from "react-router-dom";
import { FOLLOW_UNFOLLOW } from "../GraphQL/Mutations";
import Loading from "./Loading";

function ProfileInfo() {
	const client = useApolloClient();

	const { id } = useParams();
	const [d, setD] = useState("");

	const Ctx = useContext(Context);

	const navigate = useNavigate();

	const { loading, error, data } = useQuery(GET_PUBLICDATA, {
		variables: {
			username: id,
		},
	});
	// if (loading) return <Loading />;
	if (error) alert("Error Loading Profile");

	const [followUnfollow, { dataMut, errorMut, loadingMut }] =
		useMutation(FOLLOW_UNFOLLOW);

	async function call() {
		await followUnfollow({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				username: d,
			},
		}).then(() => window.location.reload());
	}

	useEffect(() => {
		setD(id);
	}, [id]);

	if (error) {
		navigate("/404");
	}

	useEffect(() => {
		const followBtn = document.querySelector(".followBtn");

		followBtn.addEventListener("mousedown", (e) => {
			e.preventDefault();
		});

		followBtn.addEventListener("touchstart", (e) => {
			e.preventDefault();
		});
	});

	return (
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
				<div style={{ display: "flex", columnGap: 8 }}>
					{/* <img src="/profile.jpg" height="40px" width="40px" style={{"borderRadius": "40px"}} /> */}
					<div>
						<h3>
							{data?.getPublicInfo?.name.split(" ")[0]}{" "}
							{data?.getPublicInfo?.name.split(" ")[1]}
						</h3>
						<h5>@{data?.getPublicInfo?.username}</h5>
					</div>
				</div>
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
						{/* <div style={styles.btnDec}>&nbsp;</div> */}
					</div>
				</button>
			</div>
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
	);
}

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
