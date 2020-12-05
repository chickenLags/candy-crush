
class Circle extends Entity {
    strokeStyle = "#000000";
    fillColor = "#000000";
    filled = false;

    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    pointWithin(point) {
        return this.position.distanceFrom(point) < this.radius;
    }

    render(ctx) {
        ctx.strokeStyle = this.strokeStyle;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
        ctx.Path;

        ctx.stroke();

        if (this.filled) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
    }

    onClick() {

    }

    outofBounds() {
        let outOfLeftBound = this.position.x - this.radius < 0;
        let outOfRightBound = this.position.x + this.radius > canvas.width;
        let outOfTopBound = this.position.y - this.radius < 0;
        let outOfBottomBound = this.position.y + this.radius > canvas.height;

        return outOfLeftBound || outOfRightBound || outOfTopBound || outOfBottomBound;
    }

    isColliding(entity, ctx) {
        
        if (entity instanceof Circle) {
            let distance = this.position.distanceFrom(entity.position);
            let combinedRadius = this.radius + entity.radius;

            return distance < combinedRadius;
        }

        if (entity instanceof Square) {
            // implement
        }

        return false;
        
    }

    center() {
        return this.position;
    }
}