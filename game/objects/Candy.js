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

