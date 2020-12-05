const Candy = require('./Candy');
const Selector = require('./Selector');
const Vector = require('../../engine/classes/Vector');


class CandyGrid {
    constructor(size) {
        this.gridSize = size;

        this.rowStack = [];
        this.currentlyFalling = 0;

        this.rowAndColCount = 8;
        this.candySize = this.gridSize / this.rowAndColCount;
        this.image = new Image();
        this.initializeImage();

        this.grid = [];
        this.initializeGrid();

        this.candiesToBeRemoved = [];

        this.selector = new Selector(this.candySize, this.rowAndColCount);

        this.selected = -1;

        this.match3();
    }

    initializeImage() {
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
            this.imageWidthPart = this.image.width / 6;
            this.imageHeightPart = this.image.height / 15;
        }
        this.image.src = 'img/candies_transparent.png';
    }

    initializeGrid() {
        let row = [];
        for (let rowIndex = 0; rowIndex < this.rowAndColCount; rowIndex++) {
            let colIndex = 0;
            
            for (colIndex; colIndex < this.rowAndColCount; colIndex++) {
                let position = new Vector(rowIndex, colIndex);
                position.scale(this.candySize);
                let value = Math.round(Math.random() * 4);
                let candy = new Candy(value, position, this.candySize, rowIndex, colIndex);
                row.push(candy);
            }

            this.grid.push(row);
            row = [];

            this.rowStack.push(-1);
        }
    }

    input(mouseEvent, pos, w, h) {
        if (mouseEvent.buttons == 1) this.inputClick(new Vector(mouseEvent.offsetX, mouseEvent.offsetY), pos, w, h);
        if (mouseEvent.buttons == 0) this.inputClick(new Vector(mouseEvent.offsetX, mouseEvent.offsetY), pos, w, h);
    }


    inputClick(mousePoint, position, w, h) {
        let collisionOnXAxis = position.x < mousePoint.x && position.x + w > mousePoint.x;
        let collisionOnYAxis = position.y < mousePoint.y && position.y + h > mousePoint.y;
        let clickedInsideOfCandyGrid = collisionOnXAxis && collisionOnYAxis;

        if (!clickedInsideOfCandyGrid) {
            this.selected = -1;
            return;
        }

        let rx = mousePoint.x - position.x;
        let ry = mousePoint.y - position.y;

        let row = Math.floor(rx / this.candySize);
        let col = Math.floor(ry / this.candySize);

        // select if nothing is selected
        if (this.selected == -1) {
            this.selected = col * this.rowAndColCount + row;
            return;
        }

        // swap both candies
        let prevRow = this.selected % this.rowAndColCount;
        let prevCol = Math.floor(this.selected / this.rowAndColCount);

        // early exit on distance greater than one;
        let mayMoveCol = (row === prevRow && Math.abs(col - prevCol) > 0) 
        let mayMoveRow = (col === prevCol && Math.abs(row - prevRow) > 0) 

        // console.log(row, col, prevRow, prevCol);
        // col = mayMoveCol ? col + ((col - prevCol) / Math.abs(col - prevCol)) : col;
        // row = mayMoveRow ? row + (row - prevRow) / Math.abs(row - prevRow) : row;

        // console.log(row, col);
        

        let neighbouring = mayMoveCol || mayMoveRow;

        if (!neighbouring) {
            this.selected = -1;
            return
        }

        [this.grid[row][col], this.grid[prevRow][prevCol]] = [this.grid[prevRow][prevCol], this.grid[row][col]]
        this.grid[row][col].onfinishedAnimation = this.match3;

        this.selected = -1;
    }

    update(elapsed, offset) {
        // this.clearCandies();

        for (let rowIndex = 0; rowIndex < this.rowAndColCount; rowIndex++) {
            for (let colIndex = 0; colIndex < this.rowAndColCount; colIndex++) {
                const candy = this.grid[rowIndex][colIndex];
                candy.update(elapsed, rowIndex, colIndex, this.deathCallback);
            }
        }
    }

    deathCallback = (candy) => {
        
        // this.candiesToBeRemoved.push(candy);

        if (--this.currentlyFalling <= 0) {
            this.currentlyFalling = 0;
            this.match3();
        }


        let newCandyValue = Math.round(Math.random() * 4);
        
        let originalOldCandyColIndex = candy.colIndex;

        
        for (originalOldCandyColIndex; originalOldCandyColIndex > 0; originalOldCandyColIndex--) {
            this.grid[candy.rowIndex][originalOldCandyColIndex] = this.grid[candy.rowIndex][originalOldCandyColIndex - 1]
        }


        this.grid[candy.rowIndex][0] = new Candy(newCandyValue, new Vector(candy.position.x, this.rowStack[candy.rowIndex]-- * this.candySize), this.candySize, candy.rowIndex, candy.colIndex);
        this.grid[candy.rowIndex][0].onfinishedAnimation = () => this.resetRowStack();
    }

    // clearCandies() {
    //     if (--this.currentlyFalling <= 0) {
    //         this.currentlyFalling = 0;
    //         // this.match3();
    //     }

    //     let ci = 0;
    //     let cl = this.candiesToBeRemoved.length;

    //     for(ci; ci < cl; ci ++) {
    //         this.clearCandy(this.candiesToBeRemoved[ci]);

    //     }

    //     this.candiesToBeRemoved = [];

        
    // }

    // clearCandy(candy) {
    //     let newCandyValue = Math.round(Math.random() * 4);
    //     let originalOldCandyColIndex = candy.colIndex;
    // }

    // fillGapsWithCandies() {
    //     let ri = 0;
    //     let rl = this.grid[row]length;

    //     for (originalOldCandyColIndex; originalOldCandyColIndex > 0; originalOldCandyColIndex--) {
    //         this.grid[candy.rowIndex][originalOldCandyColIndex] = this.grid[candy.rowIndex][originalOldCandyColIndex - 1]
    //     }


    //     this.grid[candy.rowIndex][0] = new Candy(newCandyValue, new Vector(candy.position.x, this.rowStack[candy.rowIndex]-- * this.candySize), this.candySize, candy.rowIndex, candy.colIndex);
    //     this.grid[candy.rowIndex][0].onfinishedAnimation = () => this.resetRowStack();
    // }

    resetRowStack() {
        for(let i = 0; i < this.rowAndColCount; i++) {
            this.rowStack[i] = -1;
        }

        

    }

    match3 = () => {
        
        
        for (let rowIndex = 0; rowIndex < this.rowAndColCount; rowIndex++) {
            for (let colIndex = 0; colIndex < this.rowAndColCount; colIndex++) {
                const candy = this.grid[rowIndex][colIndex];

                this.match3Vertical(candy, rowIndex, colIndex);
                this.match3Horizontal(candy, rowIndex, colIndex);
            }
        }
    }

    match3Vertical(candy, rowIndex, colIndex) {

        if (colIndex > 0 && colIndex < this.rowAndColCount -1) {
            const candyUp = this.grid[rowIndex][colIndex -1];
            const candyDown = this.grid[rowIndex][colIndex + 1];

            if (candy.value == candyUp.value && candy.value == candyDown.value) {
                if (!candy.markedForDeath) ++this.currentlyFalling;
                if (!candyUp.markedForDeath) ++this.currentlyFalling;
                if (!candyDown.markedForDeath) ++this.currentlyFalling;

                candyUp.markedForDeath = true;
                candy.markedForDeath = true;
                candyDown.markedForDeath = true;
            }
        }
    }

    match3Horizontal(candy, rowIndex, colIndex) {
        if (rowIndex > 0 && rowIndex < this.rowAndColCount -1) {
            const candyLeft = this.grid[rowIndex-1][colIndex];
            const candyRight = this.grid[rowIndex+1][colIndex];

            if (candy.value == candyLeft.value && candy.value == candyRight.value) {
                if (!candy.markedForDeath) ++this.currentlyFalling;
                if (!candyLeft.markedForDeath) ++this.currentlyFalling;
                if (!candyRight.markedForDeath) ++this.currentlyFalling;

                candy.markedForDeath = true;
                candyLeft.markedForDeath = true;
                candyRight.markedForDeath = true;
            }
        }
    }

    render = (ctx, position) => {
        if (!this.loaded) {
            return;
        }

        let rowIndex = 0
        for (rowIndex; rowIndex < this.rowAndColCount; rowIndex++) {
            for (let colIndex = 0; colIndex < this.rowAndColCount; colIndex++) {
                const candy = this.grid[rowIndex][colIndex];
                candy.render(ctx, this.image, this.imageWidthPart, this.imageHeightPart, position, this.selected);
            }
        }

        this.selector.render(ctx, position, this.selected);
    }
}

module.exports = CandyGrid;
