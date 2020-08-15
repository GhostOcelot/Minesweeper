const grid = document.querySelector(".grid");
const playButton = document.querySelector(".play");
const gridWidth = 10;
const squaresArray = [];
let bombsNumber = 15;
let flags = 0;
let gameOver = false;
let bombsFound = 0;

const createEmptyGridboard = () => {
	for (let i = 0; i < gridWidth * gridWidth; i++) {
		const square = document.createElement("div");
		square.classList.add("square");
		square.textContent = i;
		grid.appendChild(square);
		square.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});
	}
};

const playGame = () => {
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

		for (let j = 0; j < squaresArray.length; j++) {
			let minesAround = 0;
			const isLeftEdge = j % gridWidth === 0;
			const isRightEdge = j % gridWidth === gridWidth - 1;

			if (squaresArray[j].classList.contains("empty")) {
				if (!isLeftEdge && squaresArray[j - 1].classList.contains("bomb")) {
					minesAround++;
				}

				if (
					j > 9 &&
					!isLeftEdge &&
					squaresArray[j - 1 - gridWidth].classList.contains("bomb")
				) {
					minesAround++;
				}

				if (j > 9 && squaresArray[j - gridWidth].classList.contains("bomb"))
					minesAround++;

				if (
					!isRightEdge &&
					j > 9 &&
					squaresArray[j + 1 - gridWidth].classList.contains("bomb")
				) {
					minesAround++;
				}

				// if (!isRightEdge && squaresArray[j + 1].classList.contains("bomb"))
				// 	minesAround++;

				// if (
				// 	j < 90 &&
				// 	!isRightEdge &&
				// 	squaresArray[j + 1 + gridWidth].classList.contains("bomb"))
				// 	minesAround++;

				// if (j < 90 && squaresArray[j + gridWidth].classList.contains("bomb"))
				// 	minesAround++;

				// if (
				// 	j < 90 &&
				// 	!isLeftEdge &&
				// 	squaresArray[j - 1 + gridWidth].classList.contains("bomb"))
				// 	minesAround++;
			}
			squaresArray[j].setAttribute("data", minesAround);
		}
	}
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

const click = (square) => {
	if (square.classList.contains("bomb")) {
		console.log("game over");
		gameOver = true;
		playButton.classList.remove("hidden");
		for (let i = 0; i < squaresArray.length; i++) {
			if (squaresArray[i].classList.contains("bomb")) {
				squaresArray[i].textContent = "💣";
			}
		}
	} else {
		square.classList.add("checked");
		if (square.classList.contains("flag")) {
			square.classList.remove("flag");
			flags--;
			square.textContent = "";
		}
	}
};

createEmptyGridboard();

playButton.addEventListener("click", () => {
	grid.innerHTML = null;
	playGame();
	playButton.classList.add("hidden");
});
