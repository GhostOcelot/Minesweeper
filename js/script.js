const grid = document.querySelector(".grid");
const playButton = document.querySelector(".play");
const gridWidth = 10;
let squaresArray = [];
let bombsNumber = 15;
let flags = 0;
let gameOver = false;
let bombsFound = 0;

const createEmptyGridboard = () => {
	for (let i = 0; i < gridWidth * gridWidth; i++) {
		const square = document.createElement("div");
		square.classList.add("square");
		// square.textContent = i;
		grid.appendChild(square);
		square.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});
	}
};

showNearbyBombs = () => {
	for (let i = 0; i < squaresArray.length; i++) {
		let minesAround = 0;
		const isLeftEdge = i % gridWidth === 0;
		const isRightEdge = i % gridWidth === gridWidth - 1;

		if (squaresArray[i].classList.contains("empty")) {
			if (!isLeftEdge && squaresArray[i - 1].classList.contains("bomb")) {
				minesAround++;
			}

			if (
				i > 9 &&
				!isLeftEdge &&
				squaresArray[i - 1 - gridWidth].classList.contains("bomb")
			) {
				minesAround++;
			}

			if (i > 9 && squaresArray[i - gridWidth].classList.contains("bomb"))
				minesAround++;

			if (
				!isRightEdge &&
				i > 9 &&
				squaresArray[i + 1 - gridWidth].classList.contains("bomb")
			) {
				minesAround++;
			}

			if (!isRightEdge && squaresArray[i + 1].classList.contains("bomb"))
				minesAround++;

			if (
				i < 90 &&
				!isRightEdge &&
				squaresArray[i + 1 + gridWidth].classList.contains("bomb")
			)
				minesAround++;

			if (i < 90 && squaresArray[i + gridWidth].classList.contains("bomb"))
				minesAround++;

			if (
				i < 90 &&
				!isLeftEdge &&
				squaresArray[i - 1 + gridWidth].classList.contains("bomb")
			)
				minesAround++;

			squaresArray[i].setAttribute("data-mines-around", minesAround);
		}
	}
};

const playGame = () => {
	squaresArray = [];
	gameOver = false;
	flags = 0;
	bombsFound = 0;

	const bombsArray = Array(bombsNumber).fill("bomb");
	const emptyArray = Array(gridWidth * gridWidth - bombsNumber).fill("empty");
	const gameArray = [...bombsArray, ...emptyArray];
	const randomOrderArray = gameArray.sort(() => Math.random() - 0.5);

	for (let i = 0; i < gridWidth * gridWidth; i++) {
		const square = document.createElement("div");
		square.setAttribute("id", i);
		square.classList.add("square");
		square.classList.add(randomOrderArray[i]);
		grid.appendChild(square);
		squaresArray.push(square);

		square.addEventListener("click", () => {
			if (!gameOver) {
				click(square);
			}
		});

		square.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			if (!gameOver) {
				addFlag(square);
			}
		});
	}
	showNearbyBombs();
};

const addFlag = (square) => {
	if (
		!square.classList.contains("flag") &&
		!square.classList.contains("checked")
	) {
		square.classList.add("flag");
		square.textContent = "🚩";
		flags++;
	} else if (
		square.classList.contains("flag") &&
		!square.classList.contains("checked")
	) {
		square.classList.remove("flag");
		square.textContent = "";
		flags--;
	}
	win(square);
};

const win = (square) => {
	if (square.classList.contains("flag") && square.classList.contains("bomb")) {
		bombsFound++;
	}
	if (bombsFound === bombsNumber && flags === bombsNumber) {
		gameOver = true;
		flags = 0;
		bombsFound = 0;
		playButton.classList.remove("hidden");
		console.log("Victory!!!");
	}
};

const fail = () => {
	console.log("game over");
	gameOver = true;
	playButton.classList.remove("hidden");
	for (let i = 0; i < squaresArray.length; i++) {
		if (squaresArray[i].classList.contains("bomb")) {
			squaresArray[i].textContent = "💣";
		}
	}
};

const click = (square) => {
	if (square.classList.contains("bomb")) {
		fail();
	} else {
		square.classList.add("checked");

		if (square.getAttribute("data-mines-around") > 0) {
			square.textContent = square.getAttribute("data-mines-around");
		} else {
			if (!square.classList.contains("x")) {
				checkNeighborhood(square);
				square.classList.add("x");
			}
		}

		if (square.classList.contains("flag")) {
			square.classList.remove("flag");
			flags--;
			square.textContent = "";
		}
	}
};
let counter = 0;

const checkNeighborhood = (square) => {
	const isLeftEdge = square.id % gridWidth === 0;
	const isRightEdge = square.id % gridWidth === gridWidth - 1;

	setTimeout(() => {
		if (!isLeftEdge) {
			click(document.getElementById(squaresArray[Number(square.id) - 1].id));
			counter++;
		}

		if (!isLeftEdge && square.id > 9) {
			click(
				document.getElementById(
					squaresArray[Number(square.id) - 1 - gridWidth].id
				)
			);
			counter++;
		}

		if (square.id > 9) {
			click(
				document.getElementById(squaresArray[Number(square.id) - gridWidth].id)
			);
			counter++;
		}

		if (!isRightEdge && square.id > 9) {
			click(
				document.getElementById(
					squaresArray[Number(square.id) - gridWidth + 1].id
				)
			);
			counter++;
		}

		if (!isRightEdge) {
			click(document.getElementById(squaresArray[Number(square.id) + 1].id));
			counter++;
		}

		if (!isRightEdge && square.id < 90) {
			click(
				document.getElementById(
					squaresArray[Number(square.id) + 1 + gridWidth].id
				)
			);
			counter++;
		}

		if (square.id < 90) {
			click(
				document.getElementById(squaresArray[Number(square.id) + gridWidth].id)
			);
			counter++;
		}

		if (!isLeftEdge && square.id < 90) {
			click(
				document.getElementById(
					squaresArray[Number(square.id) - 1 + gridWidth].id
				)
			);
			counter++;
		}
		console.log(counter);
	}, 1);
};

createEmptyGridboard();

playButton.addEventListener("click", () => {
	grid.innerHTML = null;
	playGame();
	playButton.classList.add("hidden");
});
