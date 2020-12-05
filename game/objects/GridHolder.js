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
