// Imports
import { useState, useEffect, useContext } from "react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "@apollo/client";
import { LIKE_POST, VIEW_POST } from "../GraphQL/Mutations";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Post(props) {
	// Initializing hooks and state
	const { ref, inView } = useInView();
	const [liking, setLiking] = useState(false);
	const Ctx = useContext(Context);
	const navigate = useNavigate();

	// Initializing mutations
	const [postViewed, { data, error, loading }] = useMutation(VIEW_POST);
	const [postLiked, { dataLike, errorLike, loadingLike }] =
		useMutation(LIKE_POST);

	// Function to call the VIEW_POST mutation
	async function call(id, secretkey, post) {
		await postViewed({
			variables: {
				post,
				secretkey,
				id,
			},
		});
	}

	// Calling the 'call' function when the post comes into view
	useEffect(() => {
		if (inView) {
			call(Ctx.id, Ctx.secretkey, props.data.id);
		}
	}, [inView]);

	// Function to handle post like
	async function like() {
		setLiking(true);
		const res = await postLiked({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				post: props.data.id,
			},
		});
		if (res) {
			setLiking(false);
		}
	}

	return (
		<section
			style={{ ...styles.section, ...(!Ctx.id && { marginTop: 40 }) }}
			ref={ref}
			// onClick={() => navigate(`/post/id/${props?.data?.id}`)}
			onDoubleClick={() => like()}
		>
			{/* User avatar */}
			<div>
				<div
					onClick={() =>
						navigate(`/profile/${props?.data?.user?.username}`)
					}
					style={{
						borderRadius: 80,
						backgroundColor: "#F3F3F3",
						backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${props?.data?.user?.id})`,
						backgroundSize: "cover",
						height: 80,
						width: 80,
						backgroundPosition: "50% center",
					}}
				>
					&nbsp;
				</div>
			</div>

			{/* Post content */}
			<div
				style={{
					paddingBottom: "8px",
					position: "relative",
					width: "100%",
				}}
			>
				<h3
					onClick={() =>
						navigate(`/profile/${props?.data?.user?.username}`)
					}
					style={{ textAlign: "left" }}
				>
					{props?.data?.user?.name}
				</h3>
				<h5
					onClick={() =>
						navigate(`/profile/${props?.data?.user?.username}`)
					}
					style={{ textAlign: "left" }}
				>
					@{props?.data?.user?.username}
				</h5>
				<p
					onClick={() => navigate(`/post/id/${props?.data?.id}`)}
					style={{ textAlign: "left", padding: "0px 0px" }}
				>
					{props?.data?.content}
				</p>

				{/* Rendering 'liked' animation */}
				{liking ? (
					<img
						src="/heart.svg"
						alt="Liked Post"
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: `translate(-50%, -50%)`,
						}}
					/>
				) : null}

				{/* Rendering post image */}
				<div
					onClick={() => navigate(`/post/id/${props?.data?.id}`)}
					style={{
						width: "100%",
						maxWidth: 640,
						backgroundImage: `url(${Ctx.imageServer}/fetch/post/${props?.data?.id})`,
						backgroundSize: "cover",
						aspectRatio: "1/1",
						height: "100% !important",
						marginTop: 8,
						borderRadius: 8,
						display: !props?.data?.photo ? "none" : null,
					}}
				>
					&nbsp;
				</div>
			</div>
		</section>
	);
}

// Defining styles
const styles = {
	section: {
		display: "flex",
		width: "calc(100vw - 32px)",
		boxSizing: "border-box",
		columnGap: "8px",
		margin: "0px 0 16px",
	},
	imagecontent: {
		borderRadius: "8px",
		marginBottom: "8px",
	},
};

export default Post;
