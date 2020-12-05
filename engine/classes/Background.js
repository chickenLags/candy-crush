const Entity = require("../../engine/classes/Entities/Entity");

class Background extends Entity {
    constructor(imageUrl, canvas) {
        super(0, 0);
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.image = new Image();
        this.imageUrl = imageUrl;
        
        this.loaded = false;
        this.image.onload = () => this.loaded = true;

        this.image.src = this.imageUrl;
    }

    render(ctx) {
        if (!this.loaded) {
            return;
        }
        
        ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Background;