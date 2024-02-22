import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "./Slider";

function Input(props) {
	const [val, setVal] = useState("");
	const [verify, setVerify] = useState(false);
	const navigate = useNavigate();
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
		inputRef.current.value = "";
	}, [props]);

	const styles = {
		overlay: {
			position: "absolute",
			height: "100svh",
			// top: 0,
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
					if (!/\w\s/.test(char)) {
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
			console.log("FILE");
			const response = await fetch(val);
			const imageBlob = await response.blob();
			const reader = new FileReader();
			reader.readAsArrayBuffer(imageBlob);
			reader.onload = (event) => {
				const uint8Array = new Uint8Array(event.target.result);
				console.log(uint8Array);
				props?.value(uint8Array);
			};
		}
	}

	useEffect(() => {
		console.log(verify);
		if (verify) {
			setVerify(false);
			completeInput();
		}
	}, [verify]);

	const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];

	function change(e) {
		if (props?.type == "file") {
			console.log(e.target.files);
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
						onClick={() => (window.location.href = props.referer)}
						onTouchStart={() => navigate(`${props.referer}`)}
					>
						<img src="/arrow-back-circle.svg" alt="Back" />
					</button>
				</section>
			</section>
		</>
	);
}

export default Input;
