class PenTool extends DrawingTool {
    
    onMouseUp(mouseEvent) {
        this.drawing = false;
    }

    onMouseDown(mouseEvent) {

    }

    onMouseMove(mouseEvent) {
        if (mouseEvent.buttons == 1) {
            ctx.beginPath();

            if (this.drawing) {
                ctx.moveTo(this.startX, this.startY);
                ctx.lineTo(mouseEvent.offsetX, mouseEvent.offsetY);
            }
        
            this.drawing = true;
            this.startX = mouseEvent.offsetX;
            this.startY = mouseEvent.offsetY;
        
            ctx.stroke();
            
        }
    }
}