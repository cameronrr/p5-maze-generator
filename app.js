/// <reference path="./p5.global-mode.d.ts" />

// debug flag will control whether to show grid highlighting of each update
const debug = true;

// frames per second
const fps = 20;

// define grid size
const rows = cols = 10;
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
let activeCell;

let status = "generating";

setup = () => {

    createCanvas(gridWidth, gridHeight);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push(new Cell(x, y))
        }
    }

    console.log(`Prepared ${cols}x${rows} grid (${grid.length} cells, each ${cellWidth}x${cellHeight})`);

    frameRate(fps);
    //noLoop();

}

draw = () => {

    background(55);

    // every update/frame, we will choose another cell
    if (status == "generating") {
        activeCell.chooseNextCell()
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
        this.endingCell = false;
        this.visitedCell = false;
        this.candidateCell = false;
        this.lastChosenCell = false;

        // if active (starting) cell is not set, check this cell
        if (!activeCell && this.x == startingCell.x && this.y == startingCell.y) {
            this.setStartingCell()
        }

    }

    cellIndex = (x, y) => {
        if (x < 0 || x >= cols || y < 0 || y >= rows) {
            return null
        } else {
            return x + (y * cols)
        }
    }

    setStartingCell = () => {
        this.startingCell = true;
        this.visitedCell = true;
        activeCell = this;
    }

    getValidAdjacentCells = () => {
        let cells = [];

        let x = this.x;
        let y = this.y;

        cells.push(grid[this.cellIndex(x, y - 1)]);
        cells.push(grid[this.cellIndex(x, y + 1)]);
        cells.push(grid[this.cellIndex(x - 1, y)]);
        cells.push(grid[this.cellIndex(x + 1, y)]);

        // keep truthy values (i.e. discard undefined) and not visited cells
        return cells.filter( e => e && !e.visitedCell );
   
    }

    chooseNextCell = () => {

        let cells = this.getValidAdjacentCells();

        if (cells.length > 0) {

            let cellIndex = Math.floor(Math.random() * cells.length)

            //console.log(cells);
            //console.log(cellIndex);            

            for (let i = 0; i < cells.length; i++) {
                if (i == cellIndex) {
                    this.setNextActiveCell(cells[i])
                } else {
                    cells[i].candidateCell = true
                }
            }

        } else {
            activeCell.endingCell = true;
            status = "finished"
        }

    }

    setNextActiveCell = (cell) => {
        cell.lastChosenCell = true;
        cell.visitedCell = true;
        activeCell = cell;
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
            if (this.startingCell) {
                fill(0, 255, 0, 75);
                rect(x, y, cellWidth, cellHeight)
            } else if (this.endingCell) {
                fill(255, 0, 0, 75);
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
        this.candidateCell = false
        this.lastChosenCell = false

    };

}