export default function Loading() {
	return <h2 style={styles.display}>Loading</h2>;
}

const styles = {
	display: {
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
};
