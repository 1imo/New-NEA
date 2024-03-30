// Imports
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";

function MessageInsight(props) {
	// Accessing the Context object
	const Ctx = useContext(Context);

	// Finding the recipient user from the chatroomUsers array
	const recipient = props?.data?.chatroomUsers?.find(
		(chatter) => chatter.id !== Ctx.id
	);

	// If no recipient is found, reload the page
	if (!recipient) window.location.reload();

	// Calculating the date and time differences
	const date = new Date(props?.data?.lastMessage?.date);
	const currentDate = new Date();
	const differenceInDays = Math.abs(currentDate.getDate() - date.getDate());

	// Formatting the date based on the difference in days
	const formattedDate =
		differenceInDays < 1
			? date.toLocaleTimeString("en-US", {
					minute: "2-digit",
					hour: "2-digit",
			  })
			: date.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
			  });

	// Determining the visibility of the unread indicator
	const read =
		props?.data?.lastMessage?.read == true
			? { display: "none" }
			: { display: "block" };
	console.log(read);
	console.log(props);
	console.log(props?.data?.lastMessage);

	return (
		<>
			<Link to={`id/${props?.data?.id}`}>
				<section
					style={{
						display: "flex",
						columnGap: 8,
						alignItems: "center",
						margin: "16px 0",
						width: "100%",
						justifyContent: "space-between",
					}}
				>
					<img
						src={`${Ctx.imageServer}/fetch/profile/${recipient?.id}`}
						height="80px"
						width="80px"
						style={{ borderRadius: 400, aspectRatio: "1/1" }}
					/>
					<div style={{ width: "calc(100% - 96px)" }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "calc(100%)",
							}}
						>
							<h4>{recipient?.name}</h4>
							<div
								style={{ ...styles.unread, ...read }}
								aria-label={"checked" ? "unread" : null}
							>
								&nbsp;
							</div>
						</div>
						<p
							style={{
								width: "calc(100vw - 32px - 88px)",
								textOverflow: "ellipsis",
								overflow: "hidden",
								whiteSpace: "nowrap",
							}}
						>
							{props?.data?.lastMessage?.content ||
								recipient?.name?.split(" ")[0] +
									" has started a chat w you"}
						</p>
						<p style={{ fontWeight: 500 }}>
							{formattedDate != "Invalid Date"
								? formattedDate
								: null}
						</p>
					</div>
				</section>
			</Link>
		</>
	);
}

// Defining styles for the unread indicator
const styles = {
	unread: {
		boxSizing: "border-box",
		height: 16,
		width: 16,
		background: "#4C9BF7",
		borderRadius: 32,
	},
};

export default MessageInsight;
