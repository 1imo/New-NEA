import { useEffect, useState } from "react";

function Slider(props) {
	// State variables
	const [x, setX] = useState(0);
	const [perc, setPerc] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [initialX, setInitialX] = useState(0);
	const [intervalId, setIntervalId] = useState(null);

	// Styles
	const styles = {
		outer: {
			width: "100%",
			height: 64,
			padding: 8,
			borderRadius: 16,
			background: perc > 0.67 ? "#4CF790" : "#0B0A07",
			position: "relative",
		},
		inner: {
			height: 64,
			width: 64,
			borderRadius: 16,
			background: "#fff",
			position: "absolute",
			left: x + 8,
			zIndex: 2,
		},
	};

	// Mouse down event handler
	const handleMouseDown = (e) => {
		setIsDragging(true);
		setInitialX(e.clientX);
	};

	// Touch start event handler
	const handleTouchStart = (e) => {
		e.preventDefault();
		setIsDragging(true);
		setInitialX(e.touches[0].clientX);
	};

	// Mouse up event handler
	const handleMouseUp = (e) => {
		setIsDragging(false);
		clearInterval(intervalId);
		setIntervalId(null);
		setPerc(x / (window.innerWidth - styles.inner.width - 200));

		if (x >= Math.min(((window.innerWidth - 200) / 3) * 2)) {
			const remainingDistance = Math.min(window.innerWidth - 200) - x;
			setX(x + remainingDistance);

			setTimeout(() => {
				props?.verify(true);
			}, 250);

			setTimeout(() => {
				setPerc(0);
				setX(0);
				setInitialX(0);
			}, 251);
		} else {
			setX(0);
		}
	};

	// Touch end event handler
	const handleTouchEnd = (e) => {
		e.preventDefault();
		setIsDragging(false);
		clearInterval(intervalId);
		setIntervalId(null);
		setPerc(x / (window.innerWidth - styles.inner.width - 200));

		if (x >= Math.min((window.innerWidth - 200) / 2)) {
			const remainingDistance = Math.min(window.innerWidth - 200) - x;
			setX(x + remainingDistance);

			setTimeout(() => {
				props?.verify(true);
			}, 250);

			setTimeout(() => {
				setPerc(0);
				setX(0);
				setInitialX(0);
			}, 251);
		} else {
			setX(0);
		}
	};

	// Mouse move event listener
	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isDragging]);

	// Mouse move event handler
	const handleMouseMove = (e) => {
		const deltaX = e.clientX - initialX;
		setX(
			Math.max(
				0,
				Math.min(
					window.innerWidth - styles.inner.width - 200,
					x + deltaX
				)
			)
		);
		setPerc(x / (window.innerWidth - styles.inner.width - 200));
	};

	// Touch move event handler
	const handleTouchMove = (e) => {
		const deltaX = e.touches[0].clientX - initialX;
		setX(
			Math.max(
				0,
				Math.min(window.innerWidth - styles.inner.width - 200, deltaX)
			)
		);
		setPerc(x / (window.innerWidth - styles.inner.width - 200));
	};

	// Cleanup interval on component unmount
	useEffect(() => {
		return () => clearInterval(intervalId);
	}, []);

	// Reset slider when props.verify changes
	useEffect(() => {
		if (props?.verify) {
			setInitialX(0);
			setIsDragging(false);
			setX(0);
			setPerc(0);
		}
	}, [props?.verify]);

	return (
		<div
			style={styles.outer}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<div
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				className="sliderInner"
				style={styles.inner}
			>
				&nbsp;
			</div>
		</div>
	);
}

export default Slider;
