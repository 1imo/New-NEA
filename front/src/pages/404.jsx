// Define the NotFound functional component
export default function NotFound() {
	// Return JSX that will be rendered when the component is used
	return (
		<main style={styles.main}>
			{/* Display a simple message indicating the page was not found */}
			<h2 style={styles.h2}>404</h2>
			<h3 style={styles.h3}>Page Not Found</h3>
		</main>
	);
}

const styles = {
	main: {
		width: "100%",
		height: "100svh",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		rowGap: "8px",
	},
	h2: {
		color: "#CECECD",
		fontSize: 25,
		lineHeight: "40px",
		fontFamily: "Climate Crisis",
	},
	h3: {
		color: "#CECECD",
		fontSize: 15,
		lineHeight: "24px",
		fontFamily: "Poppins",
		fontWeight: 700,
	},
};
