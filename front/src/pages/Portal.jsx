import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Portal() {
	const images = useRef([
		"image14.jpg",
		"image31.jpg",
		"image15.jpg",
		"image32.jpg",
		"image16.jpg",
		"image34.jpg",
		"image17.jpg",
		"image19.jpg",
		"image20.jpg",
		"image21.jpg",
		"image22.jpg",
		"image25.jpg",
		"image28.jpg",
	]);
	const queueTop = useRef(images.current);
	const removeX = useRef(0);
	const queueBottom = useRef(
		images.current.map(
			(im, ind) => images.current[images.current.length - ind - 1]
		)
	);
	const [val, setVal] = useState(0);

	useEffect(() => {
		let count = 0;
		const animationInterval = setInterval(() => {
			removeX.current = removeX.current + 1;
			setVal((val) => val + 1);
			// count += 1;
			if (removeX.current == 96) {
				let one = queueTop.current.shift();
				queueTop.current = queueTop.current.concat(one);
				let two = queueBottom.current.pop();
				queueBottom.current = [two, ...queueBottom.current];
				count -= 96;
				removeX.current = removeX.current - 96;
				setVal((val) => val - 96);
			}
		}, 40);

		return () => {
			clearInterval(animationInterval);
		};
	}, []);

	function ProfileTop(props) {
		const { path } = props;
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 8,
					cursor: "pointer",
					textAlign: "center",
					transform: `translateX(-${val}px)`,
					transition: "transform 0.5s ease defer",
				}}
			>
				<div
					style={{
						borderRadius: 800,
						backgroundColor: "#F3F3F3",
						backgroundImage: `url(/${path})`,
						backgroundSize: "cover",
						height: 80,
						width: 80,
						backgroundPosition: "50% center",
						boxShadow:
							"2px 2px 16px 0 rgba(133, 132, 131, 0.5), -4px -2px 16px rgba(243, 243, 243)",
					}}
				>
					&nbsp;
				</div>
			</div>
		);
	}

	function ProfileBottom(props) {
		const { path } = props;
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 8,
					cursor: "pointer",
					textAlign: "center",
					transform: `translateX(${val}px)`,
					transition: "transform 0.5s ease defer",
				}}
			>
				<div
					style={{
						borderRadius: 800,
						backgroundColor: "#F3F3F3",
						backgroundImage: `url(/${path})`,
						backgroundSize: "cover",
						height: 80,
						width: 80,
						backgroundPosition: "50% center",
						boxShadow:
							"2px 2px 16px 0 rgba(133, 132, 131, 0.5), -4px -2px 16px rgba(243, 243, 243)",
					}}
				>
					&nbsp;
				</div>
			</div>
		);
	}

	return (
		<section style={styles.section} className="authScreen">
			<div style={styles.options}>
				<div
					style={styles.providers}
					onClick={() =>
						(window.location.href =
							"http://127.0.0.1:8000/auth/google")
					}
				>
					<img
						height={24}
						width={24}
						src="/google.svg"
						alt="Sign In w Google"
					/>
					<h5>Sign In with Google</h5>
				</div>

				<div style={styles.buttons} className="buttons">
					<Link to="/sign_in" style={styles.button}>
						Sign In
					</Link>
					<Link to="/onboarding" style={{ textDecoration: "none" }}>
						Sign Up
					</Link>
				</div>
			</div>
			<div style={styles.heading} className="subheading">
				<h2>Hi There!</h2>
				<div style={styles.subheading}>
					<p>Sign in below</p>
					<img src="/smiley.jpg" alt=":)" height={20} width={20} />
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						position: "relative",
						marginTop: 80,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							columnGap: 16,
							marginBottom: 8,
							justifyContent: "center",
						}}
					>
						{queueTop.current?.length > 0 &&
							queueTop?.current?.map((path, index) => {
								return <ProfileTop path={path} key={index} />;
							})}
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							columnGap: 16,
							justifyContent: "center",
						}}
					>
						{queueBottom.current?.length > 0 &&
							queueBottom?.current?.map((path, index) => {
								return (
									<ProfileBottom path={path} key={index} />
								);
							})}
					</div>
				</div>
			</div>
		</section>
	);
}

const styles = {
	section: {
		width: "100vw !important",
		height: "100svh",
		// margin: "auto",
		display: "flex",
		flexDirection: "column-reverse",
		// alignItems: "center",
		boxSizing: "border-box",
		padding: "160px 0 80px",

		justifyContent: "space-around",
		overflow: "hidden",
	},
	heading: {
		display: "flex",
		flexDirection: "column",
		rowGap: 0,
	},
	subheading: {
		display: "flex",
		alignItems: "center",
		columnGap: 8,
	},
	providers: {
		display: "flex",
		alignItems: "center",
		columnGap: 16,
		background: "#4C9BF7",
		width: "fit-content",
		padding: "4px 40px",
		color: "#fff",
		borderRadius: 4,
		justifyContent: "center",
		boxSize: "border-box",
		margin: "0 auto",
	},
	buttons: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		rowGap: 24,
		alignItems: "center",
		fontFamily: "'Poppins', sans-serif",
		fontSize: "15px",
		lineHeight: "24px",
	},
	button: {
		height: 40,
		borderRadius: 8,
		background: "#0B0A07",
		color: "#fff",
		width: "100%",
		border: "none",
		fontFamily: "'Poppins', sans-serif",
		fontSize: 15,
		lineHeight: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	options: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
		marginTop: 80,
		justifyContent: "space-between",
		alignItems: "center",
	},
};

export default Portal;
