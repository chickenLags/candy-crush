const entityManager = require("../../engine/classes/EntityManager");
const Background = require("../../engine/classes/Background");
const GridHolder = require("../objects/GridHolder");

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        entityManager.clear();
        this.background = new Background('img/background.jpg', this.canvas);
        let lesser = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        
        let gx = this.canvas.width - lesser * 0.8 - 100;
        let gy = 100;
        this.gridHolder = new GridHolder(gx, gy, canvas);
        // this.scoreField = new ScoreField();

        entityManager.add(this.background);
        entityManager.add(this.gridHolder);
        // entityManager.add(this.scoreField);
    }
}

module.exports = Game;