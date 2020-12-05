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
