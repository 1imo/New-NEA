export default function Loading() {
	return (
		<section style={styles.display}>
			<h2 style={styles.content}>Loading</h2>
		</section>
	);
}

const styles = {
	content: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		color: "#CECECD",
		fontSize: 15,
		lineHeight: "24px",
		fontFamily: "Poppins",
		fontWeight: 700,
	},
	display: {
		zIndex: 10,
		background: "#fff",
		width: "100%",
		height: "100svh",
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
};
