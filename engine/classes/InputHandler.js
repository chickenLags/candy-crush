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
