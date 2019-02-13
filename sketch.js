/// <reference path="./p5.global-mode.d.ts" />

let cellWidth = 50;
let cellHeight = 50;

let gridWidth = 500;
let gridHeight = 500;

let grid = [];

function setup() {
    createCanvas(gridWidth, gridHeight);

    let rows = floor(height / cellWidth);
    let cols = floor(width / cellHeight);

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            grid.push(new Cell(x, y));
        }
    }

    console.log(`Prepared ${cols}x${rows} grid (${grid.length} cells, each ${cellWidth}x${cellHeight})`)
}

function draw() {
    background(51);

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
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
        }
    }

    show = function() {

        let x = this.x * cellWidth;
        let y = this.y * cellHeight;

        stroke(150, 18, 23);

        /* // top, bottom, left and right lines
        line(x, y, x + cellWidth, y)
        line(x, y + cellHeight, x + cellWidth, y + cellHeight)
        line(x, y, x, y + cellHeight)
        line(x + cellWidth, y, x + cellWidth, y + cellHeight) */

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

    };

}