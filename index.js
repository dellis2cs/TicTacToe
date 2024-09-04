const header = document.querySelector(".header");
const reset = document.querySelector(".reset");
const start = document.querySelector(".start");
const player1Input = document.querySelector("#player1");
const player2Input = document.querySelector("#player2");
const player1Label = document.querySelector(".label1");
const player2Label = document.querySelector(".label2");

const boardContainerVisibility = document.querySelector(".board");
reset.addEventListener("click", function () {
  location.reload();
});

const gameBoard = (function () {
  //initialize rows columns and the game board
  const rows = 3;
  const columns = 3;
  const board = [];

  //create the game board by filling each space with a zero
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = "";
    }
  }
  //fetches the current board, rows, and columns
  const getBoard = () => board;
  const getRows = () => rows;
  const getColumns = () => columns;

  return { getBoard, getRows, getColumns };
})();

const gameController = (function () {
  //Player 1
  const player1 = "X";

  let player1Name;

  //Player 2
  const player2 = "O";

  let player2Name;

  const board = gameBoard.getBoard();

  let numRounds = 0;

  //Current Player(defaults to player1)
  let currentPlayer = player1;
  let currentPLayerName = player1Name;

  //fetches the current player
  const getCurrPlayer = () => currentPlayer;
  const getCurrPlayerName = () => currentPLayerName;

  //after each round switch to the other player
  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
      currentPLayerName = player2Name;
    } else {
      currentPlayer = player1;
      currentPLayerName = player1Name;
    }
  };

  //checks the given row and checks if all elements in the row are equal
  function isRowEqual(arr, rowIndex) {
    const row = arr[rowIndex];
    return row.every((element) => element === row[0]);
  }

  //checks the given column and checks if all elements in the column are equal
  function isColEqual(arr, colIndex) {
    //get the number of rows
    const numRows = arr.length;

    //get the first element of the column
    const firstElem = arr[0][colIndex];

    for (let i = 1; i < numRows; i++) {
      if (arr[i][colIndex] != firstElem) return false;
    }
    return true;
  }

  function mainDiagonalEqual() {
    const mainDiagonalValue = board[0][0];
    if (board[0][0] != "" && board[1][1] != "" && board[2][2] != "") {
      return (
        board[1][1] === mainDiagonalValue && board[2][2] === mainDiagonalValue
      );
    }
  }
  function antiDiagonalEqual() {
    if (board[0][2] != "" && board[1][1] != "" && board[2][0] != "") {
      const antiDiagonalValue = board[0][2];
      return (
        board[1][1] === antiDiagonalValue && board[2][0] === antiDiagonalValue
      );
    }
  }

  //if any row is the same or any column is the same return true
  const checkBoard = (row, col) => {
    if (
      isRowEqual(board, row) ||
      isColEqual(board, col) ||
      mainDiagonalEqual() ||
      antiDiagonalEqual()
    ) {
      return true;
    }
    numRounds++;
    //num rounds updates by 2 because we need to check whether the col or rows are equal
    if (numRounds == 18) {
      return "draw";
    }
    return false;
  };

  const updateBoard = (row, col) => {
    board[row][col] = currentPlayer;
  };

  return {
    getCurrPlayer,
    switchPlayer,
    checkBoard,
    updateBoard,
    getCurrPlayerName,
    player1Name,
    player2Name,
  };
})();

//handles the ui updates
const DisplayController = (function () {
  //captures the board container from my html
  const boardContainer = document.querySelector(".board");

  //fetches the board from my gameBoard module
  const board = gameBoard.getBoard();

  //fetches the rows and columns from the gameBoard module
  const rows = gameBoard.getRows();
  const columns = gameBoard.getColumns();

  //sets the number of columns and rows based on the board
  boardContainer.style.gridTemplateRows = `repeat(${rows},1fr)`;
  boardContainer.style.gridTemplateColumns = `repeat(${columns},1fr)`;

  //Used as an increment variable to correspond with the cell's row in the html
  let i = -1;

  //loops through the board and creates a new div(cell) and appends to the grid container
  board.forEach((row) => {
    //Used as an increment variable to correspond with the cell's column in the html
    let j = 0;
    i++;
    row.forEach((item) => {
      const cell = document.createElement("div");
      cell.textContent = item;
      cell.classList.add("cell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      boardContainer.appendChild(cell);
      j++;
    });
  });

  //when a cell is clicked
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      if (cell.textContent === "") {
        cell.textContent = gameController.getCurrPlayer();
        gameController.updateBoard(
          cell.getAttribute("data-row"),
          cell.getAttribute("data-col")
        );
        if (
          gameController.checkBoard(
            cell.getAttribute("data-row"),
            cell.getAttribute("data-col")
          ) === true
        ) {
          if (gameController.getCurrPlayer() === "X") {
            header.textContent = `${gameController.player1Name} wins!`;
            cells.forEach((cell) => {
              cell.replaceWith(cell.cloneNode(true)); // This removes all event listeners by replacing each cell with a clone of itself
            });
            reset.style.visibility = "visible";
          } else {
            header.textContent = `${gameController.player2Name} wins!`;
            cells.forEach((cell) => {
              cell.replaceWith(cell.cloneNode(true)); // This removes all event listeners by replacing each cell with a clone of itself
            });
            reset.style.visibility = "visible";
          }
        } else if (
          gameController.checkBoard(
            cell.getAttribute("data-row"),
            cell.getAttribute("data-col")
          ) == "draw"
        ) {
          header.textContent = "draw! no one wins!";
          reset.style.visibility = "visible";
        }
        gameController.switchPlayer();
      }
    });
  });
})();

start.addEventListener("click", function () {
  if (player1Input.value != "" && player2Input.value != "") {
    boardContainerVisibility.style.visibility = "visible";
    start.style.visibility = "hidden";
    gameController.player1Name = player1Input.value;
    gameController.player2Name = player2Input.value;
    player1Input.style.visibility = "hidden";
    player2Input.style.visibility = "hidden";
    player1Label.style.visibility = "hidden";
    player2Label.style.visibility = "hidden";
  }
});
