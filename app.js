/// <reference path="./p5.global-mode.d.ts" />

// debug flag will control whether to show grid highlighting of each update
const debug = true;

// frames per second (use null for default frames)
const fps = null;

// define grid size
const rows = 25;
const cols = 25;
const gridWidth = 500;
const gridHeight = 500;

// define coords for starting cell
const startingCell = {
    x: 4,
    y: 0
}

const numCells = rows * cols;
const cellWidth = gridWidth / cols;
const cellHeight = gridHeight / rows;

let grid = [];
let activeCell, nextCell;

let stack = [];

let status = "generating";

setup = () => {
    frameRate(fps);

    createCanvas(gridWidth, gridHeight);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push(new Cell(x, y))
        }
    }

    console.log(`Prepared ${cols}x${rows} grid (${grid.length} cells, each ${cellWidth}x${cellHeight})`);    
}

draw = () => {
    background(55);

    // debug will perform one step each frame using 'if'
    // as opposed to running the entire algorithm using 'while'
    if (debug) {
        if (status == "generating") {
            activeCell.chooseNextCell()
        }
    } else {
        while (status == "generating") {
            activeCell.chooseNextCell()
        }
    }

    // draw the state of each cell onto the canvas
    for (let i = 0; i < grid.length; i++) {
        grid[i].drawCell()
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true,
            bottom: true,
            left: true,
            right: true
        };
        this.startingCell = false;
        this.visitedCell = false;
        this.candidateCell = false;
        this.lastChosenCell = false;

        // if active (starting) cell is not set, check this cell
        if (!activeCell && this.x == startingCell.x && this.y == startingCell.y) {
            this.setStartingCell()
        }
    }

    addCellToStack = () => {
        stack.push(this);
    }

    setStartingCell = () => {
        this.startingCell = true;
        this.visitedCell = true;
        this.addCellToStack();
        activeCell = this;
    }

    getValidAdjacentCells = () => {
        let cells = [];

        let x = this.x;
        let y = this.y;

        cells.push(grid[cellIndex(x, y - 1)]); // top
        cells.push(grid[cellIndex(x, y + 1)]); // bottom
        cells.push(grid[cellIndex(x - 1, y)]); // left
        cells.push(grid[cellIndex(x + 1, y)]); // right

        // discard undefined values, and cells which have been visited
        return cells.filter(e => e && !e.visitedCell);
    }

    chooseNextCell = () => {
        let cells = this.getValidAdjacentCells()

        if (cells.length > 0) {
            cells.forEach(cell => cell.candidateCell = true);
            nextCell = cells[Math.floor(Math.random() * cells.length)];
            removeJoiningWall(activeCell, nextCell);
            nextCell.addCellToStack();
            nextCell.setActive();
        } else if (stack.length > 0) {
            nextCell = stack.pop();
            nextCell.setActive();
        } else {
            status = "finished";
        }
    }

    setActive = () => {
        this.lastChosenCell = true;
        this.visitedCell = true;
        activeCell = this;
    }

    drawCell = () => {
        let x = this.x * cellWidth;
        let y = this.y * cellHeight;

        stroke(255, 255, 255, 75);

        // draw applicable walls for the cell
        if (this.walls.top) {
            line(x, y, x + cellWidth, y)
        }
        if (this.walls.bottom) {
            line(x, y + cellHeight, x + cellWidth, y + cellHeight)
        }
        if (this.walls.left) {
            line(x, y, x, y + cellHeight)
        }
        if (this.walls.right) {
            line(x + cellWidth, y, x + cellWidth, y + cellHeight)
        }

        // visual aid to track the various cell types and generator progress
        if (debug) {
            noStroke()
            if (this.startingCell) {
                fill(0, 255, 0, 75);
                rect(x, y, cellWidth, cellHeight)
            } else if (this.lastChosenCell) {
                fill(255, 0, 0, 75);
                rect(x, y, cellWidth, cellHeight)
            } else if (this.candidateCell) {
                fill(0, 0, 255, 75);
                rect(x, y, cellWidth, cellHeight)
            } else if (this.visitedCell) {
                fill(255, 0, 255, 75);
                rect(x, y, cellWidth, cellHeight)
            }
        }

        // reset these values for the next update/frame
        this.candidateCell = false;
        this.lastChosenCell = false;
    }
}

cellIndex = (x, y) => {
    return x < 0 || x >= cols || y < 0 || y >= rows ? null : x + (y * cols);
}

removeJoiningWall = (cell1, cell2) => {
    let deltaX = cell1.x - cell2.x; // movement on the x axis
    let deltaY = cell1.y - cell2.y; // movement on the y axis

    if (deltaX == 0) {
        if (deltaY == 1) {
            // cell2 is above cell1
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        } else {
            // cell2 is below cell1
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        }
    } else {
        if (deltaX == 1) {
            // cell2 is left of cell1
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else {
            // cell2 is right of cell1
            cell1.walls.right = false;
            cell2.walls.left = false;
        }
    }
}