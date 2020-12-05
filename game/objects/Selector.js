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