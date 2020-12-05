class RectTool extends DrawingTool {
    
    onMouseUp(mouseEvent) {
        entityManager.add(new SquareCollidable(this.startX, this.startY, mouseEvent.offsetX - this.startX, mouseEvent.offsetY - this.startY));
    }

    onMouseDown(mouseEvent) {
        this.startX = mouseEvent.offsetX;
        this.startY = mouseEvent.offsetY;
    }

    onMouseMove(mouseEvent) {

    }
}