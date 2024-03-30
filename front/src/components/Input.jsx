// Imports
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "./Slider";

function Input(props) {
	// State initialization
	const [val, setVal] = useState("");
	const [verify, setVerify] = useState(false);

	// Hook initialization
	const navigate = useNavigate();
	const inputRef = useRef(null);

	// Focusing the input field and clearing its value when the component mounts or props change
	useEffect(() => {
		inputRef.current.focus();
		inputRef.current.value = "";
	}, [props]);

	// Defining styles for various elements
	const styles = {
		overlay: {
			position: "absolute",
			height: "100svh",
			left: "50%",
			transform: "translateX(-50%)",
			width: "calc(100vw - 32px)",
			zIndex: 10,
			display: "flex",
			flexDirection: "columnn",
			justifyContent: "center",
		},
		inp: {
			marginTop: 40,
		},
		file: {
			width: 160,
			height: 160,
			background: "#F3F3F3",
			backgroundImage: `url(${val})`,
			backgroundSize: "cover",
			marginTop: (window.innerWidth - 160) / 2,
			borderRadius: 160,
		},
		second: {
			height: "80px",
			width: "80px",
			aspectRatio: "1/1",
			borderRadius: 16,
			border: "1px solid #0B0A07",
			background: "#0B0A07",
		},
		input: {
			width: "calc(100vw - 32px)",
			display: "flex",
			flexDirection: "row-reverse",
			columnGap: 8,
			position: "fixed",
			top: "100%",
			transform: "translateY(calc(-100% - 8px)",
		},
	};

	// Function to complete the input process
	async function completeInput() {
		if (props?.type != "file") {
			const rawInput = inputRef.current.value.trim();
			const isValidLength = rawInput.length > 0 && rawInput.length <= 100;

			if (!isValidLength) {
				alert("Input must be between 1 and 100 characters.");
				setVerify(false);
				return;
			}

			const encodedInput = htmlSpecialChars(rawInput);

			function htmlSpecialChars(text) {
				const map = {
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&apos;",
					"&": "&amp;",
				};
				return text.replace(/[<>"&]/g, (char) => map[char]);
			}

			if (props.type == "password") {
				let hasDigit = false;
				let hasSpecial = false;
				let hasCapital = false;

				for (const char of inputRef.current.value) {
					if (/\d/.test(char)) {
						hasDigit = true;
					}
					if (/[^a-zA-Z0-9\s]/.test(char)) {
						hasSpecial = true;
					}
					if (/[A-Z]/.test(char)) {
						hasCapital = true;
					}
				}

				if (!hasDigit || !hasSpecial || !hasCapital) {
					if (!hasDigit) {
						alert("Password must have at least 1 digit");
					} else if (!hasSpecial) {
						alert(
							"Password must have at least one special character"
						);
					} else if (!hasCapital) {
						alert("Password must have at least one capital");
					}
					setVerify(false);
					return;
				}
			}

			props.value(encodedInput);
		} else {
			const response = await fetch(val);
			const imageBlob = await response.blob();
			const reader = new FileReader();
			reader.readAsArrayBuffer(imageBlob);
			reader.onload = (event) => {
				const uint8Array = new Uint8Array(event.target.result);
				props?.value(uint8Array);
			};
		}
	}

	// Calling completeInput when verify state changes
	useEffect(() => {
		if (verify) {
			setVerify(false);
			completeInput();
		}
	}, [verify]);

	const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];

	// Function to handle file input change
	function change(e) {
		if (props?.type == "file") {
			if (validMimeTypes.includes(e.target.files[0].type)) {
				const display = URL.createObjectURL(e.target.files[0]);
				setVal(display);
			}
		}
	}

	return (
		<>
			<section style={styles.overlay}>
				<input
					onChange={(e) => change(e)}
					type={props.type}
					style={props?.type != "file" ? styles.inp : styles.file}
					className="normInputScreen"
					placeholder={`${props.placeholder}`}
					ref={inputRef}
				/>
				<section style={styles.input}>
					<Slider verify={setVerify} />
					<button
						className="accentBtn"
						style={styles.second}
						onClick={() =>
							props?.referer
								? navigate(`${props.referer}`)
								: props.setChange(true)
						}
					>
						<img src="/arrow-back-circle.svg" alt="Back" />
					</button>
				</section>
			</section>
		</>
	);
}

export default Input;
