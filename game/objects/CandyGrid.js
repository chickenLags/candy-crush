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
        
        this.initializeImage();

        this.grid = [];
        this.initializeGrid();

        this.candiesToBeRemoved = [];

        this.selector = new Selector(this.candySize, this.rowAndColCount);

        this.selected = -1;

        this.match3();
    }

    initializeImage() {
        this.image = new Image();
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
        let mayMoveCol = (row === prevRow && Math.abs(col - prevCol) === 1);
        let mayMoveRow = (col === prevCol && Math.abs(row - prevRow) === 1);        

        let neighbouring = mayMoveCol || mayMoveRow;

        if (!neighbouring) {
            this.selected = -1;
            return
        }

        [this.grid[row][col], this.grid[prevRow][prevCol]] = [this.grid[prevRow][prevCol], this.grid[row][col]]

        this.moving = 2;

        this.grid[row][col].onfinishedAnimation = this.match3;
        this.grid[prevRow][prevCol].onfinishedAnimation = this.match3;

        this.selected = -1;
    }

    update(elapsed, offset) {
        let falling = 0;
        let marked = [];

        for (let rowIndex = 0; rowIndex < this.rowAndColCount; rowIndex++) {
            for (let colIndex = 0; colIndex < this.rowAndColCount; colIndex++) {
                const candy = this.grid[rowIndex][colIndex];
                candy.update(elapsed, rowIndex, colIndex);

                if (candy.rowIndex != rowIndex || candy.colIndex != colIndex || candy.justCreated) {
                    ++falling;
                }

                if (candy.markedForDeath) {
                    marked.push(candy);
                }
            }
        }

        if (falling == 0 && marked.length > 0) {
            console.log(marked.map(m => [m.rowIndex, m.colIndex]));
            // debugger;
            let removedCoords = this.clearCandies(marked);
            this.fillGrid(removedCoords);
            this.resetRowStack();
            
        }
    }

    clearCandies(marked) {
        let removedCoords = [];

        for(let i = 0; i < marked.length; ++i) {
            let candy = marked[i];

            this.grid[candy.rowIndex][candy.colIndex] = null;
            removedCoords.push([candy.rowIndex, candy.colIndex]);
            --this.rowStack[candy.rowIndex];
        }

        removedCoords.sort((a,b) => b.colIndex - a.colIndex);
        return removedCoords;
    }

    fillGrid(removedCoords) {

        for(let i = 0; i < removedCoords.length; ++i) {
            const coords = removedCoords[i];
            const rowIndex = coords[0];
            const colIndex = coords[1];
            let posX = rowIndex * this.candySize;

            let newCandyValue = Math.round(Math.random() * 4);
            let originalOldCandyColIndex = colIndex;
            
            for (originalOldCandyColIndex; originalOldCandyColIndex > 0; originalOldCandyColIndex--) {
                this.grid[rowIndex][originalOldCandyColIndex] = this.grid[rowIndex][originalOldCandyColIndex - 1]
            }
            

            let newCandyPosition = new Vector(posX, this.rowStack[rowIndex]-- * this.candySize);
            this.grid[rowIndex][0] = new Candy(newCandyValue, newCandyPosition, this.candySize, rowIndex, colIndex);
        }

    }

    resetRowStack() {
        for(let i = 0; i < this.rowAndColCount; i++) {
            this.rowStack[i] = -1;
        }
    }

    match3 = () => {  
        if (--this.moving != 0) {
            return;
        }
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
