const header = document.querySelector(".header");
const reset = document.querySelector(".reset");

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

  //Player 2
  const player2 = "O";

  const board = gameBoard.getBoard();

  let numRounds = 0;

  //Current Player(defaults to player1)
  let currentPlayer = player1;

  //fetches the current player
  const getCurrPlayer = () => currentPlayer;

  //after each round switch to the other player
  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
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
    return (
      board[1][1] === mainDiagonalValue && board[2][2] === mainDiagonalValue
    );
  }
  function antiDiagonalEqual() {
    const antiDiagonalValue = board[0][2];
    return (
      board[1][1] === antiDiagonalValue && board[2][0] === antiDiagonalValue
    );
  }

  //if any row is the same or any column is the same return true
  const checkBoard = (row, col) => {
    if (isRowEqual(board, row) || isColEqual(board, col)) {
      return true;
    }
    numRounds++;
    if (numRounds == 18) {
      return "draw";
    }
    return false;
  };

  const updateBoard = (row, col) => {
    board[row][col] = currentPlayer;
  };

  return { getCurrPlayer, switchPlayer, checkBoard, updateBoard };
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
            header.textContent = "player 1 wins!";
            cells.forEach((cell) => {
              cell.replaceWith(cell.cloneNode(true)); // This removes all event listeners by replacing each cell with a clone of itself
            });
          } else {
            header.textContent = "player 2 wins!";
            cells.forEach((cell) => {
              cell.replaceWith(cell.cloneNode(true)); // This removes all event listeners by replacing each cell with a clone of itself
            });
          }
        } else if (
          gameController.checkBoard(
            cell.getAttribute("data-row"),
            cell.getAttribute("data-col")
          ) == "draw"
        ) {
          header.textContent = "draw! no one wins!";
        }
        gameController.switchPlayer();
      }
    });
  });
})();
