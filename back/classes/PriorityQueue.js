class PriorityQueue {
	constructor(comparator = (a, b) => a - b) {
		this.values = [];
		// comparator should return a positive number if a > b
		this.comparator = comparator;
	}

	// Add a value to the queue
	enqueue(val) {
		this.values.push(val);
		let idx = this.values.length - 1;
		let parentIdx = Math.floor((idx - 1) / 2);

		// Bubble up
		while (
			parentIdx >= 0 &&
			this.comparator(this.values[parentIdx], val) > 0
		) {
			// Swap parent and child
			[this.values[idx], this.values[parentIdx]] = [
				this.values[parentIdx],
				this.values[idx],
			];
			idx = parentIdx;
			parentIdx = Math.floor((idx - 1) / 2);
		}
	}

	// Remove the highest priority value from the queue
	dequeue() {
		if (!this.values.length) {
			return null;
		}

		const root = this.values[0];
		const last = this.values.pop();

		// If not empty, move the last value to the root and bubble down
		if (this.values.length) {
			this.values[0] = last;
			let idx = 0;

			// Bubble down
			while (idx < this.values.length) {
				let leftIdx = 2 * idx + 1;
				let rightIdx = 2 * idx + 2;
				let swapIdx = null;

				if (
					leftIdx < this.values.length &&
					this.comparator(this.values[leftIdx], this.values[idx]) < 0
				) {
					swapIdx = leftIdx;
				}

				if (
					rightIdx < this.values.length &&
					this.comparator(
						this.values[rightIdx],
						this.values[swapIdx || idx]
					) < 0
				) {
					swapIdx = rightIdx;
				}

				if (swapIdx === null) {
					break;
				}

				[this.values[idx], this.values[swapIdx]] = [
					this.values[swapIdx],
					this.values[idx],
				];
				idx = swapIdx;
			}
		}

		return root;
	}

	isEmpty() {
		return this.values.length === 0;
	}
}

module.exports = PriorityQueue;
