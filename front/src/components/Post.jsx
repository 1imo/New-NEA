import { useState, useEffect, useContext } from "react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "@apollo/client";
import { LIKE_POST, VIEW_POST } from "../GraphQL/Mutations";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";

function Post(props) {
	const { ref, inView } = useInView();
	const [liking, setLiking] = useState(false);

	const Ctx = useContext(Context);
	const navigate = useNavigate();

	const [postViewed, { data, error, loading }] = useMutation(VIEW_POST);
	const [postLiked, { dataLike, errorLike, loadingLike }] =
		useMutation(LIKE_POST);

	async function call(id, secretkey, post) {
		await postViewed({
			variables: {
				post,
				secretkey,
				id,
			},
		});
	}

	useEffect(() => {
		if (inView) {
			call(Ctx.id, Ctx.secretkey, props.data.id);
		}
	}, [inView]);

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
			style={styles.section}
			ref={ref}
			onClick={() => navigate(`/post/id/${props?.data?.id}`)}
			onDoubleClick={() => like()}
		>
			<div>
				<div
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
			<div
				style={{
					paddingBottom: "8px",
					position: "relative",
					width: "100%",
				}}
			>
				<h3 style={{ textAlign: "left" }}>{props?.data?.user?.name}</h3>
				<h5 style={{ textAlign: "left" }}>
					@{props?.data?.user?.username}
				</h5>
				<p style={{ textAlign: "left", padding: "0px 0px" }}>
					{props?.data?.content}
				</p>
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
				<div
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

const styles = {
	section: {
		display: "flex",
		width: "calc(100vw - 32px)",
		boxSizing: "border-box",
		// "maxWidth": "400px",
		columnGap: "8px",
		margin: "0px 0 16px",
	},
	imagecontent: {
		borderRadius: "8px",
		marginBottom: "8px",
	},
};
export default Post;
