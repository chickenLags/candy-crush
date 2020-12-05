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
