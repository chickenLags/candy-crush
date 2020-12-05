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