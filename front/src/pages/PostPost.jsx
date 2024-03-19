// Import dependencies
import { CREATE_NEWPOST } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Nav from "../components/Nav";
import Loading from "../components/Loading";

function PostPost() {
	// Use the CREATE_NEWPOST mutation
	const [createPost, { dataMain, errorMain, loadingMain }] =
		useMutation(CREATE_NEWPOST);

	// Handle error
	if (errorMain) alert("Error Posting");

	// Handle loading
	if (loadingMain) return <Loading />;

	// Create a reference for the post input
	const postRef = useRef();

	// State for storing the photo
	const [photo, setPhoto] = useState(null);

	// Create a reference for the sent state to prevent multiple rerenders
	const sent = useRef(false);

	// Get the navigate function from useNavigate
	const navigate = useNavigate();

	// Get the context using useContext
	const Ctx = useContext(Context);

	// Function to handle posting
	async function post() {
		if (!sent.current) {
			sent.current = true;
		} else {
			return;
		}

		// Call the createPost mutation with the provided variables
		const res = await createPost({
			variables: {
				id: Ctx.id,
				secretkey: Ctx.secretkey,
				content: postRef.current.value,
				photo: photo !== null ? true : false,
			},
		});

		// If the post is created successfully and a photo is provided
		if (res?.data?.createPost?.id && photo !== null) {
			// Fetch the photo and convert it to a Blob
			const response = await fetch(photo);
			const imageBlob = await response.blob();

			// Read the image blob as an ArrayBuffer
			const reader = new FileReader();
			reader.readAsArrayBuffer(imageBlob);

			// When the image is loaded, upload it to the image server
			reader.onload = async (event) => {
				const uint8Array = new Uint8Array(event.target.result);
				const r = await fetch(Ctx.imageServer + "/upload", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: res?.data?.createPost?.id,
						image: String(uint8Array),
						correlation: "Post",
					}),
				});
			};
		}

		// If the post is created successfully, navigate to the post URL
		if (res?.data?.createPost?.url) {
			navigate(res?.data?.createPost?.url);
		}
	}

	// Function to trigger the file input click event
	function addPhoto() {
		const inp = document.querySelector(".fileInput");
		inp.click();
	}

	// Function to handle the selected photo
	async function addedPhoto(e) {
		const display = URL.createObjectURL(e.target.files[0]);
		setPhoto(display);
	}

	// Render the component
	return (
		<>
			<section style={{ height: "calc(100dvh - 136px)" }}>
				<Nav icons={false} />
				<div style={styles.input}>
					<img
						style={{ cursor: "pointer" }}
						src="/send.svg"
						onTouchEnd={() => post()}
						onClick={() => post()}
					/>
					<input
						type="text"
						placeholder="|Message"
						style={styles.inputBox}
						ref={postRef}
					/>
					<img
						style={{ cursor: "pointer" }}
						src="/image.svg"
						onTouchEnd={() => addPhoto()}
						onClick={() => addPhoto()}
					/>
					<input
						onChange={(e) => addedPhoto(e)}
						type="file"
						className="fileInput"
						style={{ display: "none" }}
						accept="image/*"
					/>
				</div>
			</section>
		</>
	);
}

// Styles object for component styling
const styles = {
	input: {
		width: "calc(100vw - 32px)",
		maxWidth: 640,
		display: "flex",
		flexDirection: "row-reverse",
		columnGap: 8,
		position: "fixed",
		bottom: 0,
		transform: "translateY(calc(-8px)",
	},
};

export default PostPost;
