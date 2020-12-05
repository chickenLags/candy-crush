(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Entity = require("../../engine/classes/Entities/Entity");

class Background extends Entity {
    constructor(imageUrl, canvas) {
        super(0, 0);
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.image = new Image();
        this.imageUrl = imageUrl;
        
        this.loaded = false;
        this.image.onload = () => this.loaded = true;

        this.image.src = this.imageUrl;
    }

    render(ctx) {
        if (!this.loaded) {
            return;
        }
        
        ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Background;
},{"../../engine/classes/Entities/Entity":3}],2:[function(require,module,exports){
const Square = require("../Entities/Square");
const Vector = require("../Vector");

class Button extends Square {

    constructor(x, y, width, height, text) {
        super(x, y, width, height);
        this.text = text;
    }

    input(mouseEvent) {
        if (this.pointWithin(new Vector(mouseEvent.offsetX, mouseEvent.offsetY))) {
            this.hovering = true;

            if(mouseEvent.buttons == 1) {        
                this.onMouseDown();
            }
        }
        else{
            this.hovering = false;
        }
        

    }

    render(ctx) {
        ctx.fillStyle = this.hovering ? 'lightblue' :  'blue';
        ctx.fillRect( this.position.x, this.position.y, this.width, this.height);

        ctx.fillStyle = "orange";
        ctx.font = "20px Arial";
        ctx.fillText(this.getText(), 10 + this.position.x, 33 + this.position.y);
    }

    onMouseDown() {
        // to be overwritten
    }

    getText() {
        return this.text;
    }
}
module.exports = Button;

},{"../Entities/Square":4,"../Vector":7}],3:[function(require,module,exports){
const Vector = require("../Vector");

class Entity {
    position = new Vector();
    outOfBounds = false;
    hovering = false;
    collidable = false;
    collided = false;

    constructor(x, y) {
        this.position = new Vector(x, y);
    }

    update(){
        //to be overwritten
    }

    render() {
        // to be overwritten
    }

    onOutOfBounds() {
        this.collided = true;
    }

    onMouseEnter() {
        this.hovering = true;
    }

    onMouseLeave() {
        this.hovering = false;
    }

    onMouseDown(mousePoint) {
        //to be overwritten
    }

    onMouseUp(mousePoint) {
        //to be overwritten
    }

    onClick() {
        //to be overwritten
    }

    outOfBounds() {
        // to be overwritten
    }

    isColliding(entity) {
        // to be overwritten
        return false;
    }

    pointWithin(point) {
        // to be overwritten
        return false;
    }

    inputClick(mousePoint){
        //to be overwritten
    }

    input(mouseEvents) {
        // to be overwritten
    }
}
module.exports = Entity;

},{"../Vector":7}],4:[function(require,module,exports){
const Entity = require("./Entity");

class Square extends Entity{
    height;
    width;
    
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    pointWithin(point) {
        let collisionOnXAxis = this.position.x < point.x && this.position.x + this.width > point.x;
        let collisionOnYAxis = this.position.y < point.y && this.position.y + this.height > point.y;

        return collisionOnXAxis && collisionOnYAxis;
    }

    render() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    outofBounds() {
        let outOfLeftBound = this.position.x < 0;
        let outOfRightBound = this.position.x + this.width > canvas.width;
        let outOfTopBound = this.position.y < 0;
        let outOfBottomBound = this.position.y + this.height > canvas.height;

        return outOfLeftBound || outOfRightBound || outOfTopBound || outOfBottomBound;
    }

    isColliding(entity) {
        if (entity instanceof Square) {
            let thisTopLeftPointWithin = entity.pointWithin(new Vector(this.position.x, this.position.y));
            let thisTopRightPointWithin = entity.pointWithin(new Vector(this.position.x + this.width, this.position.y));
            let thisBottomLeftPointWithin = entity.pointWithin(new Vector(this.position.x, this.position.y + this.height));
            let thisBottomRightPointWithin = entity.pointWithin(new Vector(this.position.x + this.width, this.position.y + this.height));

            let otherTopLeftPointWithin = this.pointWithin(new Vector(entity.position.x, entity.position.y));
            let otherTopRightPointWithin = this.pointWithin(new Vector(entity.position.x + entity.width, entity.position.y));
            let otherBottomLeftPointWithin = this.pointWithin(new Vector(entity.position.x, entity.position.y + entity.height));
            let otherBottoRightPointWithin = this.pointWithin(new Vector(entity.position.x + entity.width, entity.position.y + entity.height));

            return thisTopLeftPointWithin
                    || thisTopRightPointWithin
                    || thisBottomLeftPointWithin
                    || thisBottomRightPointWithin
                    || otherTopLeftPointWithin
                    || otherTopRightPointWithin
                    || otherBottomLeftPointWithin
                    || otherBottoRightPointWithin;
        }

        if (entity instanceof Circle) {
            return entity.isColliding(this);
        }

        return false;
    }

    center() {
        return new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2);
    }
}

module.exports = Square;
},{"./Entity":3}],5:[function(require,module,exports){
const Entity = require("./Entities/Entity");
const Vector = require("./Vector");

class EntityManager {

    constructor() {
        this.entities = [];
        this.hoveringEntities = [];
    }

    add(entity) {
        if( ! (entity instanceof Entity) ) {
            return;
        }

        this.entities.push(entity);
    }

    remove(entity) {

    }

    clear() {
        this.entities = [];
        this.hoveringEntities = [];
    }

    getEntitiesHovered(mouseEvent) {
        return this.entities.filter( entity => entity.pointWithin(new Vector(mouseEvent.offsetX, mouseEvent.offsetY)));
    }

    onMouseDown(mouseEvent) {
        this.entities.forEach(element => element.onMouseDown(mouseEvent));
    }

    onMouseUp(mouseEvent) {
        this.entities.forEach(element => element.onMouseUp(mouseEvent));
    }

    onMouseClick(mousePoint) {
        this.entities.forEach(e => e.inputClick(mousePoint));
    }

    input(mouseEvents) {
        let mouseIndex = 0;
        let mouseLength = mouseEvents.length;

        let entityIndex = 0;
        let entityLength = this.entities.length;

        for(mouseIndex; mouseIndex < mouseLength; ++mouseIndex) {
            for(entityIndex; entityIndex < entityLength; ++entityIndex) {
                this.entities[entityIndex].input(mouseEvents[mouseIndex]);
            }
        }
    }

    manageHover(mouseEvent) {
        let currentlyHovered = this.getEntitiesHovered(mouseEvent);

        this.hoveringEntities
            .filter(e => !currentlyHovered.includes(e))
            .forEach(e => e.onMouseLeave());

        currentlyHovered
            .filter(e => !this.hoveringEntities.includes(e))
            .forEach(e => e.onMouseEnter());

        this.hoveringEntities = currentlyHovered;
    }

    render(ctx) {
        let renderables = this.entities;
        renderables.forEach(entity => entity.render(ctx));
    }

    update(elapsed) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(elapsed);
        }

    }

    checkCollisions(subjectEntity, ctx) {
        this.entities.forEach(entity => {
            if (entity.collidable == true) {
                if (subjectEntity.isColliding(entity, ctx) == true) {
                    subjectEntity.collided = true;
                    subjectEntity.fillColor = "#ff0000"
                    return true;
                }
            }
        })

        return false;
    }
}

module.exports = new EntityManager();

},{"./Entities/Entity":3,"./Vector":7}],6:[function(require,module,exports){
const Vector = require("./Vector");
class InputHandler {
    constructor(canvas, entityManager) {
        this.entityManager = entityManager;
        this.mouseUpHandle = canvas.addEventListener('mouseup', this.onMouseUp)
        this.mouseDownHandle = canvas.addEventListener('mousedown', this.onMouseDown);
        this.mouseMoveHandle = canvas.addEventListener('mousemove', this.onMouseMove);
        this.mouseMoveHandle = canvas.addEventListener('click', this.onMouseClick);

        this.mouseEvents = [];
    }

    onMouseUp = (mouseEvent) => {
        // this.mousePointUp = new Vector(mouseEvent.offsetX, mouseEvent.offsetY)
        // this.entityManager.onMouseUp(this.mousePointUp);
        // this.mousePointUp.push(this.mousePointUp);
        this.mouseEvents.push(mouseEvent);
    }

    onMouseDown = (mouseEvent) => {
        // this.entityManager.onMouseDown(new Vector(mouseEvent.offsetX, mouseEvent.offsetY));
        this.mouseEvents.push(mouseEvent);
    }

    onMouseMove = (mouseEvent) => {
        // this.entityManager.manageHover(new Vector(mouseEvent.offsetX, mouseEvent.offsetY));
        // this.mouseEvents.push(mouseEvent);
    }

    onMouseClick = (mouseEvent) => {
        // this.entityManager.onMouseClick(new Vector(mouseEvent.offsetX, mouseEvent.offsetY));
        this.mouseEvents.push(mouseEvent);
    }

    poll() {
        let temp = this.mouseEvents;
        this.mouseEvents = [];
        return temp;
    }
}

module.exports = InputHandler;

},{"./Vector":7}],7:[function(require,module,exports){
class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceFrom(v2) {
        let pdx = Math.pow(this.x - v2.x, 2);
        let pdy = Math.pow(this.y - v2.y, 2);
        return Math.sqrt(pdx + pdy);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    n_add(n) {
        this.x += n;
        this.y += n;
        return this;
    }

    min(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    n_min(n) {
        this.x -= n;
        this.y -= n;
        return this;
    }

    magnitude() {
        return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
    }

    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }
    
    copy() {
        return new Vector(this.x, this.y);
    }
}

module.exports = Vector;
},{}],8:[function(require,module,exports){
// Preparing the canvas, context, inputhandler, entitymanager and gameloop.
const InputHandler = require("../engine/classes/InputHandler.js");
const entityManager = require("../engine/classes/EntityManager");

const SplashScreen = require("./scenes/SplashScreen");
const Game = require("./scenes/Game.js");

let canvas = document.querySelector('canvas');
let padding = 0;

canvas.width = window.innerWidth - padding;
canvas.height = window.innerHeight - padding;

let ctx = canvas.getContext('2d');

// let entityManager = new EntityManager();
let inputHandler = new InputHandler(canvas, entityManager);

let endTime = startTime = elapsedTime = Date.now();

/**
 * This is the game loop.
 */
// let intervalHandle = setInterval(
function gameLoop () { 
    // takes time into account
    startTime = Date.now();
    elapsedTime = (startTime - endTime) / 1000;
    endTime = startTime;

    

    // clears screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // updates and render the screen and objects
    entityManager.input(inputHandler.poll());
    entityManager.update(elapsedTime);
    entityManager.render(ctx);

    window.requestAnimationFrame(gameLoop);

} //, 1000/30);

gameLoop();



// Starting the game by assigning the current screen to The opening scene (SplashScreen())
window.currentScreen = new SplashScreen(canvas);


},{"../engine/classes/EntityManager":5,"../engine/classes/InputHandler.js":6,"./scenes/Game.js":13,"./scenes/SplashScreen":14}],9:[function(require,module,exports){
const Vector = require("../../engine/classes/Vector");
const Entity = require("../../engine/classes/Entities/Entity");

class Candy extends Entity {
    constructor(value, position, size, rowIndex, colIndex) {
        super(position.x, position.y);
        this.originalPosition = this.position;

        this.size = size;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        
        this.value = value;

        this.speed = 0.01;
        this.markedForDeath = false;
        this.justCreated = true;
    }

    update(elapsed, targetRowIndex, targetColIndex, deathCallBack) {
        if (this.rowIndex == targetRowIndex && this.colIndex == targetColIndex && !this.justCreated) {
            if (this.markedForDeath) {
                deathCallBack(this);
            }
            return;
        }

        let newPosition = new Vector(targetRowIndex, targetColIndex);
        newPosition.scale(this.size);

        let deltaPosition = newPosition.copy().min(this.originalPosition).scale(elapsed).scale(3);
        this.position.add(deltaPosition);

        if (this.position.distanceFrom(newPosition) < 10) {
            this.position = newPosition;
            this.rowIndex = targetRowIndex;
            this.colIndex = targetColIndex;
            this.justCreated = false;
            this.originalPosition = this.position;
            this.onfinishedAnimation();
        }
    }

    onfinishedAnimation() {
        // to be overwritten by encapsulating class. 
    }

    onMouseDown(mouseEvent) {
    }

    render(ctx, image, subImageWidth, subImageHeight, offset) {
        ctx.drawImage(
            image,

            this.value * subImageWidth,
            2 * subImageHeight + 2,
            subImageWidth,
            subImageHeight,

            this.position.x + offset.x,
            this.position.y + offset.y,
            this.size,
            this.size
        );
    }

}
module.exports = Candy;


},{"../../engine/classes/Entities/Entity":3,"../../engine/classes/Vector":7}],10:[function(require,module,exports){
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

},{"../../engine/classes/Vector":7,"./Candy":9,"./Selector":12}],11:[function(require,module,exports){
const Entity = require("../../engine/classes/Entities/Entity");
const CandyGrid = require("./CandyGrid");


class GridHolder extends Entity {
    constructor(x, y, canvas) {
        super(x, y);
        this.canvas = canvas;
        let lesser = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        this.decreaseFactor = 0.5;
        this.width = lesser * this.decreaseFactor;
        this.height = lesser * this.decreaseFactor;
        this.position.y /= 0.2;
        this.radius = {
            tl: 15,
            tr: 15,
            bl: 15,
            br: 15
        }

        this.candyGrid = new CandyGrid(lesser * this.decreaseFactor);
    }

    inputClick(mousePoint){
        // this.candyGrid.inputClick(mousePoint, this.position, this.width, this.height);
    }

    input(mouseEvent) {
        this.candyGrid.input(mouseEvent, this.position, this.width, this.height);
    }

    // onMouseDown(mousePoint) {
    //     this.candyGrid.onMouseDown(mousePoint, this.position, this.width, this.height);
    // }

    // onMouseUp(mousePoint) {
    //     this.candyGrid.onMouseUp(mousePoint, this.position, this.width, this.height);
    // }

    update(elapsed) {
        this.candyGrid.update(elapsed, this.position);
    }

    render(ctx) {
        ctx.fillStyle = "#00000050";

        ctx.beginPath();
        ctx.moveTo(this.position.x + this.radius.tl, this.position.y);
        ctx.lineTo(this.position.x + this.width - this.radius.tr, this.position.y);
        ctx.quadraticCurveTo(this.position.x + this.width, this.position.y, this.position.x + this.width, this.position.y + this.radius.tr);
        ctx.lineTo(this.position.x + this.width, this.position.y + this.height - this.radius.br);
        ctx.quadraticCurveTo(this.position.x + this.width, this.position.y + this.height, this.position.x + this.width - this.radius.br, this.position.y + this.height);
        ctx.lineTo(this.position.x + this.radius.bl, this.position.y + this.height);
        ctx.quadraticCurveTo(this.position.x, this.position.y + this.height, this.position.x, this.position.y + this.height - this.radius.bl);
        ctx.lineTo(this.position.x, this.position.y + this.radius.tl);
        ctx.quadraticCurveTo(this.position.x, this.position.y, this.position.x + this.radius.tl, this.position.y);
        ctx.closePath();

        ctx.fill();

        this.candyGrid.render(ctx, this.position);
    }
}

module.exports = GridHolder;

},{"../../engine/classes/Entities/Entity":3,"./CandyGrid":10}],12:[function(require,module,exports){
const Vector = require("../../engine/classes/Vector");
const Entity = require("../../engine/classes/Entities/Entity");

class Selector extends Entity {
    constructor(size, rowAndColCount) {
        super(0, 0);
        this.size = size;
        this.rowAndColCount = rowAndColCount;
        this.radius = { tl: 15, tr: 15, bl: 15, br: 15 }
    }

    render(ctx, offset, selectedIndex) {
        if (selectedIndex == -1) {
            return;
        }

        ctx.fillStyle = "#00000050";
        let posix = offset.x + (selectedIndex % this.rowAndColCount) * this.size;
        let posiy = offset.y + Math.floor(selectedIndex / this.rowAndColCount) * this.size;

        ctx.beginPath();
        ctx.moveTo(posix + this.radius.tl, posiy);
        ctx.lineTo(posix + this.size - this.radius.tr, posiy);
        ctx.quadraticCurveTo(posix + this.size, posiy, posix + this.size, posiy + this.radius.tr);
        ctx.lineTo(posix + this.size, posiy + this.size - this.radius.br);
        ctx.quadraticCurveTo(posix + this.size, posiy + this.size, posix + this.size - this.radius.br, posiy + this.size);
        ctx.lineTo(posix + this.radius.bl, posiy + this.size);
        ctx.quadraticCurveTo(posix, posiy + this.size, posix, posiy + this.size - this.radius.bl);
        ctx.lineTo(posix, posiy + this.radius.tl);
        ctx.quadraticCurveTo(posix, posiy, posix + this.radius.tl, posiy);
        ctx.closePath();

        ctx.fill();
    }
}

module.exports= Selector;
},{"../../engine/classes/Entities/Entity":3,"../../engine/classes/Vector":7}],13:[function(require,module,exports){
const entityManager = require("../../engine/classes/EntityManager");
const Background = require("../../engine/classes/Background");
const GridHolder = require("../objects/GridHolder");

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        entityManager.clear();
        this.background = new Background('img/background.jpg', this.canvas);
        let lesser = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        
        let gx = this.canvas.width - lesser * 0.8 - 100;
        let gy = 100;
        this.gridHolder = new GridHolder(gx, gy, canvas);
        // this.scoreField = new ScoreField();

        entityManager.add(this.background);
        entityManager.add(this.gridHolder);
        // entityManager.add(this.scoreField);
    }
}

module.exports = Game;
},{"../../engine/classes/Background":1,"../../engine/classes/EntityManager":5,"../objects/GridHolder":11}],14:[function(require,module,exports){
const entityManager = require("../../engine/classes/EntityManager");
const Background = require("../../engine/classes/Background");
const Button = require("../../engine/classes/Buttons/Button");
const Game = require("./Game");

class SplashScreen {
    constructor(canvas) {
        this.canvas = canvas;
        entityManager.clear();
        this.background = new Background('img/background.jpg', this.canvas);
        // this.highScores = new HighScores();

        this.startButton = new Button(70, this.canvas.height - 300, 150, 50, "Start Button");
        this.startButton.onMouseDown = () => window.currentScreen = new Game(this.canvas);

        entityManager.add(this.background);
        entityManager.add(this.startButton);
    }
}

module.exports = SplashScreen;

},{"../../engine/classes/Background":1,"../../engine/classes/Buttons/Button":2,"../../engine/classes/EntityManager":5,"./Game":13}]},{},[8]);
